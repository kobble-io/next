//const API_URL = 'https://client-sdk-backend-mtppn576oq-uc.a.run.app';
const API_URL = 'http://localhost:3005';

export class HttpClient {
	private cachedAccessToken : string | null = null;

	private makeUrl = (path: string) => {
		return new URL(path, API_URL);
	}

	constructor(private readonly getAccessToken: () => string | Promise<string>) {}

	async getJson<T = any>(path: string): Promise<T> {
		const accessToken = await this.getAccessToken();
		const url = this.makeUrl(path);
		const res = await fetch(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		// TODO: handle 401 and refresh token

		if (!res.ok) {
			throw new Error(await res.text());
		}

		const json = await res.json();

		return json as T;
	}

	async postJson<T = any, U = any>(path: string, data: U): Promise<T> {
		const accessToken = await this.getAccessToken();
		const url = this.makeUrl(path);
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(data),
		});

		// TODO: handle 401 and refresh token

		if (!res.ok) {
			throw new Error(await res.text());
		}

		const json = await res.json();

		return json as T;
	}
	
}
