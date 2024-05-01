'use client';

import { PropsWithChildren } from "react";
import { useAssertWrappedByKobbleProvider, useAuth } from "../context/hooks.js";

export const SignedOut: React.FC<PropsWithChildren> = ({ children }) => {
	useAssertWrappedByKobbleProvider(SignedOut.name);

	const { user } = useAuth();

	if (user) {
		return null;
	}

	return <>{children}</>;
};
