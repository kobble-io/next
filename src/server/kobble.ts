import { KobbleClient } from "../api/kobble";
import { getAuth } from './utils';
import {AccessControl} from "../api/access-control";

const getAccessToken = async (): Promise<string> => {
	const { session } = await getAuth();

	if (!session) {
		throw new Error('No user session found. Please log in.');
	}

	return session.accessToken;
}

const getUserId = async (): Promise<string> => {
	const { session } = await getAuth();

	if (!session) {
		throw new Error('No user found. Please log in.');
	}

	return session.user.id;
}

/**
 * Returns a client to access the Kobble API as the currently logged in user 
 * from the server side.
*/
export const getKobble = () => new KobbleClient({
	getAccessToken,
	getUserId,
});

/**
 * Returns the access control instance for the currently logged-in user.
 */
export const getAccessControl = async (): Promise<AccessControl> => {
	const kobble = await getKobble();

	return kobble.acl;
}