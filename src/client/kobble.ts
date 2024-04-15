import { KobbleClient } from "../kobble";

const getAccessToken = async (): Promise<string> => {
	const res = await fetch('/getToken');

	if (!res.ok) {
		throw new Error('Failed to get access token');
	}

	const json = await res.json();
	const token = json.accessToken;

	return token;
}

/**
 * Returns a client to access the Kobble API as the currently logged in user 
 * from the client side.
*/
export const useKobble = () => new KobbleClient({
	getAccessToken,
});
