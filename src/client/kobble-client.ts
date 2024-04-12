//const API_URL = 'https://client-sdk-backend-mtppn576oq-uc.a.run.app';
const API_URL = 'http://localhost:3005';

class KobbleClient {
	private cachedAccessToken : string | null = null;

	private async getAccessToken(): Promise<string> {
		if (this.cachedAccessToken) {
			return this.cachedAccessToken;
		}

		const res = await fetch('/getToken');

		if (!res.ok) {
			throw new Error('Failed to get access token');
		}

		const json = await res.json();
		const token = json.accessToken;

		this.cachedAccessToken = token;

		return token;
	}

	private makeUrl = (path: string) => {
		return new URL(path, API_URL);
	}

	private async getJson<T = any>(path: string): Promise<T> {
		const accessToken = await this.getAccessToken();
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
		const accessToken = await this.getAccessToken();
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

	constructor() {}

	async getSupabaseToken(): Promise<string> {
		const data = await this.postJson<{ token: string }>('/integrations/supabase/mint-user-access-token', {});

		return data.token;
	}
}

export const kobble = new KobbleClient();
