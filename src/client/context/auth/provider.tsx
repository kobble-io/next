'use client';

import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "../../../constants";
import { createContext } from 'react'
import { User } from '../../../types';

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
		router.replace('/logout');
	}

	const login = () => {
		router.replace('/login');
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
