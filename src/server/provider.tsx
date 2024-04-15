import React, { FunctionComponent, ReactNode } from "react";
import { ClientProvider } from "../client/provider";
import { getAuth } from "./utils";

export const KobbleProvider: FunctionComponent<{ children: ReactNode }> = async ({ children }) => {
	const { session } = await getAuth();

	return <ClientProvider value={{ user: session?.user ?? null }}>{children}</ClientProvider>;
}
