import { AccessControl } from "./access-control";
import { HttpClient } from "./http";
import { SdkClient } from "./sdk-client";

type KobbleConfig = {
	getAccessToken: KobbleGetAccessTokenFunction;
}

type KobbleGetAccessTokenFunction = () => Promise<string>;

export class KobbleClient {
	private readonly http: HttpClient;
	public readonly acl: AccessControl;
	public readonly sdkClient: SdkClient;

	constructor(private readonly config: KobbleConfig) {
		this.http = new HttpClient(this.config.getAccessToken);
		this.acl = new AccessControl(this.http);
		this.sdkClient = new SdkClient(this.http);
	}
}
