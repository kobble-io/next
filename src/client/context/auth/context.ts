import { createContext } from 'react'
import { User } from '../../../types';

export type AuthContextValue = {
	user: User | null;
	logout: () => void;
	login: () => void;
	isAuthenticated: boolean;
	isLoading: boolean;
}

export default createContext<AuthContextValue>({
	user: null,
	logout: () => {},
	login: () => {},
	isAuthenticated: false,
	isLoading: true,
});
