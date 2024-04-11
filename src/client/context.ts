import { createContext } from "react";
import type { User } from "../types";

export type AuthContextValue = {
	user: User | null;
}

export const authContext = createContext<AuthContextValue>({
	user: null,
});
