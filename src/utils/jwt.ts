const decode = (str: string) => Buffer.from(str, 'base64url').toString('utf8');

export const jwtParseClaims = <T>(token: string) => {
	const parts = token.split('.');

	if (parts.length !== 3) {
		throw new Error('JWT must have 3 parts');
	}

	const [, payload] = parts;

	return JSON.parse(decode(payload)) as T;
}
