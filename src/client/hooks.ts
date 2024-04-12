import { useContext } from "react"
import { authContext } from "./provider"

export const useAuth = () => {
	const { user, logout, login } = useContext(authContext);

	return { user, logout, login };
}
