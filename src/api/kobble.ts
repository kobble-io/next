import { AccessControl } from "./access-control";
import { HttpClient } from "./http";
import { SdkClient } from "./sdk-client";

type KobbleConfig = {
	getAccessToken: KobbleGetAccessTokenFunction;
	getUserId: KobbleGetUserIdFunction;
}

type KobbleGetAccessTokenFunction = () => Promise<string>;
type KobbleGetUserIdFunction = () => Promise<string>;

export class KobbleClient {
	private readonly http: HttpClient;
	public readonly acl: AccessControl;
	public readonly sdkClient: SdkClient;
	
	getAcl(): AccessControl {
		return this.acl;
	}

	constructor(private readonly config: KobbleConfig) {
		this.http = new HttpClient(this.config.getAccessToken);
		this.acl = new AccessControl(this.http, this.config.getUserId);
		this.sdkClient = new SdkClient(this.http);
	}

	getSupabaseToken = async (): Promise<string> => {
		return this.sdkClient.getSupabaseToken();
	}
}
