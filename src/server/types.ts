import { User } from "../types";

export type KobbleAuth = {
	user: User | null;
	accessToken: string | null;
	idToken: string | null;
}

export type AuthMiddlewareOptions = {
	publicRoutes?: string[];
	unauthenticatedRedirectPath?: string;
	loggedOutRedirectPath?: string;
	loggedInRedirectPath?: string;
}
