import React, { FunctionComponent, ReactNode } from "react";
import { getAuth } from "./utils";
import AuthProvider from "../client/context/auth/provider";
import AccessControlProvider from "../client/context/access-control/provider";

export const KobbleProvider: FunctionComponent<{ children: ReactNode }> = async ({ children }) => {
	const { session } = await getAuth();

	return (
		<KobbleProvider>
			<AuthProvider value={{ user: session?.user ?? null }}>
				<AccessControlProvider>
					{children}
				</AccessControlProvider>
			</AuthProvider>
		</KobbleProvider>
	);
}
