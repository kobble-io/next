'use client';

import type { FunctionComponent, ReactNode } from 'react';
import { createContext, useRef } from "react";
import type { User } from "../types";
import { useRouter } from 'next/navigation';
import { KobbleClient } from './kobble-client';

export type AuthContextValue = {
	user: User | null;
	logout: () => void;
	login: () => void;
	kobble: KobbleClient;
}

export const authContext = createContext<AuthContextValue>({
	user: null,
	logout: () => {},
	login: () => {},
	kobble: {} as any,
})

export const ClientProvider: FunctionComponent<{ value: { user: User | null }, children: ReactNode }> = ({ value, children }) => {
	const router = useRouter();
	const kobble = useRef(new KobbleClient());

	const logout = () => {
		router.replace('/logout');
	}

	const login = () => {
		router.replace('/login');
	}

	return <authContext.Provider value={{
		user: value.user,
		kobble: kobble.current,
		login,
		logout
	}}>{children}</authContext.Provider>;
}
