import { cookies } from "next/headers";
import { User } from "../types";
import { ACCESS_TOKEN_COOKIE_NAME, ID_TOKEN_COOKIE_NAME } from "./constants";
import { IdTokenPayload } from "./internal-types";
import { jwtParseClaims } from "../utils/jwt";
import { KobbleAuth } from "./types";

export const auth = (): KobbleAuth => {
	const ck = cookies();
	const accessToken = ck.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const idToken = ck.get(ID_TOKEN_COOKIE_NAME)?.value;

	if (!accessToken || !idToken) {
		return { user: null, accessToken: null, idToken: null };
	}
	
	const idTokenPayload = jwtParseClaims<IdTokenPayload>(idToken);
	const user: User = {
		id: idTokenPayload.id,
		email: idTokenPayload.email,
		name: idTokenPayload.name,
		pictureUrl: idTokenPayload.picture_url,
		isVerified: idTokenPayload.is_verified,
		stripeId: idTokenPayload.stripe_id,
		createdAt: new Date(idTokenPayload.created_at),
		updatedAt: new Date(idTokenPayload.updated_at),
	}

	return { user, idToken, accessToken };
}

/**
 * Get the current user's authentication information. If the access
 * token is expired, this function will attempt to refresh it or throw.
 */
export const getAuth = async () => {
	return auth();
}
