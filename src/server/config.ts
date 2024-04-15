export type Config = {
	clientId: string;
	portalUrl: string;
	redirectUri: string;
	clientSecret: string;
}

const loadConfig = (): Config => {
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



export const config = loadConfig();
