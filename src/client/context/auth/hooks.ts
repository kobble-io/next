import { useContext } from "react"
import authContext from './context'

export const useAuth = () => {
	const { user, login, logout } = useContext(authContext);

	return { user, login, logout };
}
