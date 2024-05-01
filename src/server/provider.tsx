import React, { PropsWithChildren } from "react";
import { getAuth } from "./utils";
import AuthProvider from "../client/context/auth/provider";
import AccessControlProvider from "../client/context/access-control/provider";
import KobbleClientProvider from '../client/context/kobble/provider';

export const KobbleProvider: React.FC<PropsWithChildren> = async ({ children }) => {
	const { session } = await getAuth();

	return (
		<KobbleClientProvider>
			<AuthProvider value={{ user: session?.user ?? null }}>
				<AccessControlProvider>
					{children}
				</AccessControlProvider>
			</AuthProvider>
		</KobbleClientProvider>
	);
}
