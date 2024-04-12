import { useContext } from "react"
import { authContext } from "./provider"

export const useAuth = () => {
	const { user } = useContext(authContext);

	return { user };
}
