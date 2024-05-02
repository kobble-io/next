import { useContext } from "react"
import { authContext } from "./provider";

export const useAuth = () => {
	const { user, login, logout } = useContext(authContext);

	return { user, login, logout };
}
