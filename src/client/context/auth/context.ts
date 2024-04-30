import { createContext } from 'react'
import { User } from '../../../types';

export type AuthContextValue = {
	user: User | null;
	logout: () => void;
	login: () => void;
}

export default createContext<AuthContextValue>({
	user: null,
	logout: () => {},
	login: () => {},
});
