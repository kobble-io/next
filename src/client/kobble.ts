import { routes } from "../constants";
import { KobbleClient } from "../api/kobble";
import {Cache} from "../utils/cache";

const getAccessToken = async (): Promise<string> => {
	const res = await fetch(routes.token);

	if (!res.ok) {
		throw new Error('Failed to get access token');
	}

	const json = await res.json();
	const token = json.accessToken;

	return token;
}

const userIdCache = new Cache<string>({
	defaultTtl: 20 // 20 seconds
})

const userIdCacheKey = 'userId';
const cacheUserId = async (userId: string) => {
	userIdCache.set(userIdCacheKey, userId);
}

const getCachedUserId = async (): Promise<string | null> => {
	return userIdCache.get(userIdCacheKey)
}

const getUserId = async (): Promise<string> => {
	const cached = await getCachedUserId();

	if (cached) {
		return cached;
	}

	const res = await fetch(routes.user);

	if (!res.ok) {
		throw new Error('Failed to get user id');
	}

	const json = await res.json();

	const userId = json.user?.id;

	await cacheUserId(userId);

	return userId;
}

/**
 * Returns a client to access the Kobble API as the currently logged-in user
 * from the client side.
*/
export const createClientSideKobble = () => new KobbleClient({
	getAccessToken,
	getUserId,
});
