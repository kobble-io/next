import { cookies } from "next/headers";
import { User } from "../types";
import { ACCESS_TOKEN_COOKIE_NAME, ID_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "./constants";
import { IdTokenPayload } from "./internal-types";
import { jwtParseClaims } from "../utils/jwt";
import { KobbleAuth } from "./types";
import { config } from "./config";

const idTokenToUser = (idToken: string): User => {
	const idTokenPayload = jwtParseClaims<IdTokenPayload>(idToken);

	return {
		id: idTokenPayload.id,
		email: idTokenPayload.email,
		name: idTokenPayload.name,
		pictureUrl: idTokenPayload.picture_url,
		isVerified: idTokenPayload.is_verified,
		stripeId: idTokenPayload.stripe_id,
		createdAt: new Date(idTokenPayload.created_at),
		updatedAt: new Date(idTokenPayload.updated_at),
	}
}

const requestToken = async (currentRefreshToken?: string): Promise<{ accessToken: string, idToken: string, refreshToken: string }> => {
	const tokenUrl = new URL('/api/oauth/token', config.portalUrl);

	const payload = new URLSearchParams({
		client_id: config.clientId,
		client_secret: config.clientSecret,
	});

	if (currentRefreshToken) {
		payload.set('refresh_token', currentRefreshToken);
		payload.set('grant_type', 'refresh_token');
	} else {
		payload.set('grant_type', 'access_token');
	}

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

		throw new Error('Failed to refresh token');
	}

	const { access_token: accessToken, id_token: idToken, refresh_token: refreshToken } = await res.json();

	return { idToken, accessToken, refreshToken };
}

export const refreshAccessToken = (refreshToken: string) => requestToken(refreshToken);

/**
 * Get the current user's authentication information. If the access
 * token is expired, this function will attempt to refresh it or throw.
 */
export const getAuth = async (): Promise<KobbleAuth> => {
	const ck = cookies();
	const accessToken = ck.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const idToken = ck.get(ID_TOKEN_COOKIE_NAME)?.value;
	const refreshToken = ck.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

	if (!accessToken || !idToken || !refreshToken) {
		return { session: null };
	}

	return {
		session: {
			user: idTokenToUser(idToken),
			accessToken,
			refreshToken,
			idToken,
		}
	}
}
