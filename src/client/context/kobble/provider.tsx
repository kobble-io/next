'use client';

import { ReactNode, useRef } from "react";
import { createClientSideKobble } from "../../kobble";
import { createContext } from "react";
import { KobbleClient } from "../../../api/kobble";

export type KobbleContextType = {
	kobble: KobbleClient;
}

export const kobbleContext = createContext<KobbleContextType | null>(null);

export const KobbleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const kobble = useRef(createClientSideKobble());

	return (
		<kobbleContext.Provider value={{ kobble: kobble.current }}>
			{children}
		</kobbleContext.Provider>
	)
}
