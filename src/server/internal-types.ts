import { NextRequest, NextResponse } from "next/server";

export type IdTokenPayload = {
	sub: string;
	id: string;
	email: string;
	name: string | null;
	picture_url: string | null;
	is_verified: boolean;
	stripe_id: string | null;
	updated_at: string;
	created_at: string;
	iat: number;
	exp: number;
	iss: string;
	aud: string;
}

export type RouteHandler = (req: NextRequest, options: AuthMiddlewareConfig) => Promise<NextResponse> | NextResponse;

export type OAuthState = {
	origin: string;
}

export type AuthMiddlewareConfig = {
	portalUrl: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}
