'use client';

import { ReactNode, useRef } from "react";
import { createClientSideKobble } from "../../kobble";
import kobbleContext from './context';

const KobbleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const kobble = useRef(createClientSideKobble());

	return (
		<kobbleContext.Provider value={{ kobble: kobble.current }}>
			{children}
		</kobbleContext.Provider>
	)
}

export default KobbleProvider;
