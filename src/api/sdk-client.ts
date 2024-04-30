import { HttpClient } from './http.js'

export type GetTokenResponse = {
  token: string
}

export class SdkClient {
  constructor(private readonly http: HttpClient) {}

  public async getSupabaseToken(): Promise<string> {
    const { token } = await this.http.postJson(`/integrations/supabase/mint-user-access-token`, {});

    return token
  }
}

