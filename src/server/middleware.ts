import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME, DEFAULT_OAUTH_SCOPE, ID_TOKEN_COOKIE_NAME } from "./constants";
import { AuthMiddlewareOptions } from "./types";
import { auth } from "./utils";
import { AuthMiddlewareConfig } from "./internal-types";
import { jwtParseClaims } from "../utils/jwt";

const createAuthorizationUrl = (config: AuthMiddlewareConfig): URL => {
	const { clientId, portalUrl, redirectUri } = config;
	const url = new URL('/oauth/authorize', portalUrl);

	url.searchParams.set('response_type', 'code');
	url.searchParams.set('client_id', clientId);
	url.searchParams.set('redirect_uri', redirectUri);
	url.searchParams.set('scope', DEFAULT_OAUTH_SCOPE);
	url.searchParams.set('state', 'kobble');

	return url;
}

const handleLogin = async (request: NextRequest, config: AuthMiddlewareConfig, options: AuthMiddlewareOptions) => {
	const url = request.nextUrl.clone();

	url.pathname = options.loggedInRedirectPath ?? '/';

	const authorizationUrl = createAuthorizationUrl(config);

	return NextResponse.redirect(authorizationUrl);
}

const handleOAuthCallback = async (request: NextRequest, config: AuthMiddlewareConfig, options: AuthMiddlewareOptions) => {
	const code = request.nextUrl.searchParams.get('code');

	if (!code) {
		return NextResponse.json({ message: 'missing code' });
	}

	const serializedState = request.nextUrl.searchParams.get('state');

	if (!serializedState) {
		return NextResponse.json({ message: 'missing state' });
	}

	const {  clientId, portalUrl, redirectUri, clientSecret } = config;

	const tokenUrl = new URL('/api/oauth/token', portalUrl);
	const payload = new URLSearchParams({
		code,
		client_id: clientId,
		client_secret: clientSecret,
		redirect_uri: redirectUri,
		grant_type: 'authorization_code',
	});

	const res = await fetch(tokenUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: payload.toString()
	});

	if (!res.ok) {
		const text = await res.text();
		console.error('Failed to exchange code for token', res.status, text);

		return NextResponse.json({ 
			message: 'failed to exchange code for token', 
			error: {
				status: res.status,
				data: text,
			}
		});
	}

	const { access_token, id_token, refresh_token } = await res.json();

	const resUrl = request.nextUrl.clone();

	resUrl.pathname = options.loggedInRedirectPath ?? '/';

	const nextRes = NextResponse.redirect(resUrl);

	nextRes.cookies.set(ACCESS_TOKEN_COOKIE_NAME, access_token, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
	});
	nextRes.cookies.set(ID_TOKEN_COOKIE_NAME, id_token, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
	});

	return nextRes;
}

const refreshAccessToken = async (config: AuthMiddlewareConfig, refreshToken: string) => {
	const { clientId, portalUrl, clientSecret } = config;

	const tokenUrl = new URL('/api/oauth/token', portalUrl);

	const payload = new URLSearchParams({
		refresh_token: refreshToken,
		client_id: clientId,
		client_secret: clientSecret,
		grant_type: 'refresh_token',
	});

	const res = await fetch(tokenUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: payload.toString()
	});

	if (!res.ok) {
		const text = await res.text();
		console.error('Failed to refresh token', res.status, text);

		return null;
	}
}

const handleGetToken = async (request: NextRequest, config: AuthMiddlewareConfig, options: AuthMiddlewareOptions) => {
	if (request.method !== 'GET') {
		return NextResponse.json({ message: 'method not allowed'}, { status: 405 });
	}
	
	const { accessToken } = auth();

	if (!accessToken) {
		return NextResponse.json({ message: 'missing access token' });
	}

	const payload = jwtParseClaims<{ exp: number }>(accessToken);

	// refresh token if it expires in less than an hour
	if (payload.exp < Date.now() / 1000 + 3600) {
		return NextResponse.json({ message: 'token refresh is not implemented yet.' });
	}

	return NextResponse.json({ accessToken });
}

const handleLogout = (request: NextRequest, _: AuthMiddlewareConfig, options: AuthMiddlewareOptions) => {
	const resUrl = request.nextUrl.clone();

	resUrl.pathname = options.loggedOutRedirectPath ?? '/';

	const nextRes = NextResponse.redirect(resUrl);

	nextRes.cookies.delete(ACCESS_TOKEN_COOKIE_NAME);
	nextRes.cookies.delete(ID_TOKEN_COOKIE_NAME);

	return nextRes;
}

const kobblePath = (base: string, path: string) => {
	return `${base}${path}`;
}

const loadMiddlewareConfigOrThrow = (): AuthMiddlewareConfig => {
	const clientId = process.env.NEXT_PUBLIC_KOBBLE_CLIENT_ID;

	if (!clientId) {
		throw new Error('Missing NEXT_PUBLIC_KOBBLE_CLIENT_ID');
	}

	const portalUrl = process.env.NEXT_PUBLIC_KOBBLE_DOMAIN;

	if (!portalUrl) {
		throw new Error('Missing NEXT_PUBLIC_KOBBLE_DOMAIN');
	}

	const redirectUri = process.env.NEXT_PUBLIC_KOBBLE_REDIRECT_URI;

	if (!redirectUri) {
		throw new Error('Missing NEXT_PUBLIC_KOBBLE_REDIRECT_URI');
	}

	const clientSecret = process.env.KOBBLE_CLIENT_SECRET;

	if (!clientSecret) {
		throw new Error('Missing KOBBLE_CLIENT_SECRET');
	}

	return {
		clientId,
		portalUrl,
		redirectUri,
		clientSecret,
	};
}

export const authMiddleware = (options: AuthMiddlewareOptions) => {
	const config = loadMiddlewareConfigOrThrow();
	const { publicRoutes = [], unauthenticatedRedirectPath } = options;
	const oauthCallbackPath = new URL(config.redirectUri).pathname;
	const kobbleRoutes = {
		'/login': handleLogin,
		'/logout': handleLogout,
		'/getToken': handleGetToken,
		[oauthCallbackPath]: handleOAuthCallback,
	};

	return (request: NextRequest) => {
		console.debug('authMiddleware', request.nextUrl.pathname);
		const currentPath = request.nextUrl.pathname;

		if (publicRoutes.includes(currentPath)) {
			console.info(`${currentPath} is a public route, skipping auth check.`);

			return NextResponse.next();
		}

		if (kobbleRoutes[currentPath]) {
			return kobbleRoutes[currentPath](request, config, options);
		}

		const { user } = auth();

		if (user) {
			return NextResponse.next();
		}

		if (unauthenticatedRedirectPath) {
			const url = request.nextUrl.clone();

			url.pathname = unauthenticatedRedirectPath;

			return NextResponse.redirect(url);
		}

		return handleLogin(request, config, options);
	}
}
