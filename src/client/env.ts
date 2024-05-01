export type ClientEnvironment = {
	domain: string;
}

export default {
	domain: process.env.NEXT_PUBLIC_KOBBLE_DOMAIN!,
}
