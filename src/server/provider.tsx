import type { FunctionComponent, ReactNode } from "react";
import { ClientProvider } from "../client/provider";
import { auth } from "./utils";

export const KobbleProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
	const { user } = auth();

	return <ClientProvider value={{ user }}>{children}</ClientProvider>;
}
