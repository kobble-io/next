import { KobbleClient } from "../api/kobble";
import { getAuth } from './utils';

const getAccessToken = async (): Promise<string> => {
	const { session } = await getAuth();

	if (!session) {
		throw new Error('No user session found. Please log in.');
	}

	return session.accessToken;
}

/**
 * Returns a client to access the Kobble API as the currently logged in user 
 * from the server side.
*/
export const getKobble = () => new KobbleClient({
	getAccessToken,
});
