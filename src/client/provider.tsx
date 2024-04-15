'use client';

import type { FunctionComponent, ReactNode } from 'react';
import { createContext } from "react";
import type { User } from "../types";
import { useRouter } from 'next/navigation';

export type AuthContextValue = {
	user: User | null;
	logout: () => void;
	login: () => void;
}

export const authContext = createContext<AuthContextValue>({
	user: null,
	logout: () => {},
	login: () => {},
})

export const ClientProvider: FunctionComponent<{ value: { user: User | null }, children: ReactNode }> = ({ value, children }) => {
	const router = useRouter();

	const logout = () => {
		router.replace('/logout');
	}

	const login = () => {
		router.replace('/login');
	}

	return <authContext.Provider value={{
		user: value.user,
		login,
		logout
	}}>{children}</authContext.Provider>;
}
