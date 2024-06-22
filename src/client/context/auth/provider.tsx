'use client';

import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { routes } from "../../../constants";
import { createContext } from 'react'
import { User } from '../../../types';
import env from '../../env';

export type AuthContextValue = {
	user: User | null;
	logout: () => void;
	login: () => void;
	isAuthenticated: boolean;
	isLoading: boolean;
}

export const authContext = createContext<AuthContextValue>({
	user: null,
	logout: () => {},
	login: () => {},
	isAuthenticated: false,
	isLoading: true,
});

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const isAuthenticated = !!user && !isLoading;
	const pathname = usePathname();
	const previousPathname = useRef<string | null>(null);

	const fetchUser = useCallback(async (): Promise<User | null>  => {
		const res = await fetch(routes.user);

		if (!res.ok) {
			return null;
		}

		const { user } = await res.json();

		return user;
	}, [])
	
	useEffect(() => {
		fetchUser().then((user) => {
			setUser(user);
		}).finally(() => {
			setIsLoading(false);
		});
	}, [])

	const logout = () => {
		router.replace(new URL(routes.logout, env.domain).toString());
		setUser(null);
	}

	const login = () => {
		router.replace(new URL(routes.login, env.domain).toString());
	}

	return (
		<authContext.Provider value={{
			user,
			logout,
			login,
			isAuthenticated,
			isLoading,
		}}>
			{children}
		</authContext.Provider>
	);
}

export default AuthProvider;
