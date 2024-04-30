'use client';

import { ReactNode } from "react";
import { User } from "../../../types";
import { useRouter } from "next/navigation";
import authContext from "./context";

const AuthProvider: React.FC<{ value: { user: User | null }, children: ReactNode }> = ({ value, children }) => {
	const router = useRouter();

	const logout = () => {
		router.replace('/logout');
	}

	const login = () => {
		router.replace('/login');
	}

	return (
		<authContext.Provider value={{
			user: value.user,
			logout,
			login
		}}>
			{children}
		</authContext.Provider>
	);
}

export default AuthProvider;
