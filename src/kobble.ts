//const API_URL = 'https://client-sdk-backend-mtppn576oq-uc.a.run.app';
const API_URL = 'http://localhost:3005';

type KobbleConfig = {
	getAccessToken: KobbleGetAccessTokenFunction;
}

type KobbleGetAccessTokenFunction = () => Promise<string>;

export class KobbleClient {
	private cachedAccessToken : string | null = null;

	private makeUrl = (path: string) => {
		return new URL(path, API_URL);
	}

	private async getJson<T = any>(path: string): Promise<T> {
		const accessToken = await this.config.getAccessToken();
		const url = this.makeUrl(path);
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (response.status === 401) {
			if (!this.cachedAccessToken) {
				window.location.reload();
			}

			this.cachedAccessToken = null;

			return this.getJson(path);
		}

		const json = await response.json();

		return json as T;
	}

	private async postJson<T = any, U = any>(path: string, data: U): Promise<T> {
		const accessToken = await this.config.getAccessToken();
		const url = this.makeUrl(path);
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(data),
		});

		if (response.status === 401) {
			if (!this.cachedAccessToken) {
				window.location.reload();
			}

			this.cachedAccessToken = null;

			return this.postJson(path, data);
		}

		const json = await response.json();

		return json as T;
	}

	constructor(private readonly config: KobbleConfig) {}

	async getSupabaseToken(): Promise<string> {
		const data = await this.postJson<{ token: string }>('/integrations/supabase/mint-user-access-token', {});

		return data.token;
	}
}
