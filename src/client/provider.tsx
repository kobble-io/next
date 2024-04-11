'use client';

import type { FunctionComponent, ReactNode } from 'react';
import { AuthContextValue, authContext } from './context';

export const ClientProvider: FunctionComponent<{ value: AuthContextValue, children: ReactNode }> = ({ value, children }) => {
	return <authContext.Provider value={value}>{children}</authContext.Provider>;
}
