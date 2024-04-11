import { useContext } from "react"
import { authContext } from "./context"

export const useAuth = () => {
	const { user } = useContext(authContext);

	return { user };
}
