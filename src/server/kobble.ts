import { KobbleClient } from "../kobble";
import { auth } from './utils';

const getAccessToken = async (): Promise<string> => {
	const { accessToken } = auth();

	if (!accessToken) {
		throw new Error('Failed to get access token on the server. Is your app properly initialized?');
	}

	return accessToken;
}

/**
 * Returns a client to access the Kobble API as the currently logged in user 
 * from the server side.
*/
export const getKobble = () => new KobbleClient({
	getAccessToken,
});
