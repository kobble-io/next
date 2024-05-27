import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME, DEFAULT_OAUTH_SCOPE, ID_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "./constants";
import { AuthMiddlewareOptions } from "./types";
import { AuthMiddlewareConfig } from "./internal-types";
import { routes } from "../constants";
import { getAuth, refreshAccessToken } from "./utils";
import { config } from "./config";
import { jwtParseClaims } from "../utils/jwt";
import { pathToRegexp } from "path-to-regexp";
import { cookies } from "next/headers";
import { Logger } from "../utils/logger";

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

const laxCookieOptions = {
	httpOnly: true,
	secure: true,
	// We need a lax policy because we are setting cookies after a redirect from
	// an external domain.
	// See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#lax
	sameSite: 'lax',
} as const;

const setResponseCookies = (res: NextResponse, accessToken: string, refreshToken: string, idToken: string) => {
	res.cookies.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, laxCookieOptions);
	res.cookies.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, laxCookieOptions);
	res.cookies.set(ID_TOKEN_COOKIE_NAME, idToken, laxCookieOptions);
}

const handleLogin = async (_: NextRequest, __: NextResponse, ___: AuthMiddlewareOptions) => {
	const authorizationUrl = createAuthorizationUrl(config);

	return NextResponse.redirect(authorizationUrl);
}

const handleUser = async (req: NextRequest, res: NextResponse, options: AuthMiddlewareOptions) => {
	const { session } = await getAuth();

	if (!session) {
		return NextResponse.json({ message: 'No user session found. Please log in.' }, { ...res, status: 401 });
	}

	return NextResponse.json({ user: session.user }, res);
}

const handleOAuthCallback = async (req: NextRequest, res: NextResponse, options: AuthMiddlewareOptions) => {
	const code = req.nextUrl.searchParams.get('code');

	if (!code) {
		return NextResponse.json({ message: 'missing code' });
	}

	const serializedState = req.nextUrl.searchParams.get('state');

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

	const tokenRes = await fetch(tokenUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: payload.toString()
	});

	if (!tokenRes.ok) {
		const text = await tokenRes.text();

		console.error('Failed to exchange code for token', tokenRes.status, text);

		return NextResponse.json({ 
			message: 'failed to exchange code for token', 
			error: {
				status: tokenRes.status,
				data: text,
			}
		}, { ...res, status: 500 });
	}

	const { access_token, id_token, refresh_token } = await tokenRes.json();
	const resUrl = req.nextUrl.clone();

	for (const [k] of req.nextUrl.searchParams) {
		resUrl.searchParams.delete(k);
	}

	resUrl.pathname = options.loggedInRedirectPath ?? '/';

	const nextRes = NextResponse.redirect(resUrl, { status: 302 });

	setResponseCookies(nextRes, access_token, refresh_token, id_token);

	return nextRes;
}

const handleGetToken = async (request: NextRequest, res: NextResponse, _: AuthMiddlewareOptions) => {
	if (request.method !== 'GET') {
		return NextResponse.json({ message: 'method not allowed'}, { status: 405 });
	}
	
	const { session } = await getAuth();

	if (!session) {
		return NextResponse.json({ message: 'No user session found. Please log in.' }, { ...res, status: 401 });
	}

	return NextResponse.json({ accessToken: session.accessToken }, res);
}

const handleLogout = (req: NextRequest, _: NextResponse, options: AuthMiddlewareOptions) => {
	const resUrl = req.nextUrl.clone();

	resUrl.pathname = options.loggedOutRedirectPath ?? '/';

	const nextRes = NextResponse.redirect(resUrl);

	nextRes.cookies.delete(ACCESS_TOKEN_COOKIE_NAME);
	nextRes.cookies.delete(ID_TOKEN_COOKIE_NAME);
	nextRes.cookies.delete(REFRESH_TOKEN_COOKIE_NAME);

	return nextRes;
}

export const authMiddleware = (options: AuthMiddlewareOptions) => {
	const { publicRoutes = [], unauthenticatedRedirectPath } = options;
	const oauthCallbackPath = new URL(config.redirectUri).pathname;
	const kobbleRoutes = {
		[routes.login]: handleLogin,
		[routes.logout]: handleLogout,
		[routes.token]: handleGetToken,
		[routes.user]: handleUser,
		[oauthCallbackPath]: handleOAuthCallback,
	};
	const logger = new Logger('KobbleMiddleware', options.logLevel ?? 'INFO');

	return async (req: NextRequest): Promise<NextResponse> => {
		const currentPath = req.nextUrl.pathname;
		const { session } = await getAuth();
		const res = new NextResponse(); 

		if (options.logLevel === 'DEBUG') {
			const method = req.method.padEnd(6);
			const pathname = req.nextUrl.pathname.padEnd(30);
			const metadata = `(user=${session?.user?.id ?? 'N/A'})}`.padStart(40);

			logger.debug(`${method} ${pathname} ${metadata}`);
		}

		if (session) {
			const payload = jwtParseClaims<{ exp: number }>(session.accessToken);
			const isNearExpiration = payload.exp * 1000 < Date.now() + 1000 * 3600;

			if (isNearExpiration) {
				try {
					logger.info('Access token expires soon, attempting refresh...')
					const { accessToken, refreshToken, idToken  } = await refreshAccessToken(session.refreshToken);

					setResponseCookies(res, accessToken, refreshToken, idToken);

					logger.info('Access token refreshed successfully');

					return res;
				} catch (e) {
					logger.error('Failed to refresh access token', e);

					return handleLogout(req, res, options);
				}
			}
		}

		if (kobbleRoutes[currentPath]) {
			return kobbleRoutes[currentPath](req, res, options);
		}

		const canAccessPath = (path: string) => {
			if (session) {
				return true;
			}

			return publicRoutes.some((route) => {
				const regex = pathToRegexp(route);
				return regex.test(path);
			});
		}

		if (canAccessPath(currentPath)) {
			return NextResponse.next(res);
		} 

		if (unauthenticatedRedirectPath) {
			const url = req.nextUrl.clone();

			url.pathname = unauthenticatedRedirectPath;

			return NextResponse.redirect(url, res);
		}

		return handleLogin(req, res, options);
	}
}
