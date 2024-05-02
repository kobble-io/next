import React, { PropsWithChildren } from "react";
import AuthProvider from "../client/context/auth/provider";
import { AccessControlProvider } from "../client/context/access-control/provider";
import { KobbleProvider as KobbleClientProvider } from '../client/context/kobble/provider';

export const KobbleProvider: React.FC<PropsWithChildren> = async ({ children }) => {
	return (
		<KobbleClientProvider>
			<AuthProvider>
				<AccessControlProvider>
					{children}
				</AccessControlProvider>
			</AuthProvider>
		</KobbleClientProvider>
	);
}
