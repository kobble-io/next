import { useContext } from "react"
import { authContext } from "./provider"
import { KobbleClient } from "./kobble-client";

export const useAuth = () => {
	const { user, logout, login } = useContext(authContext);

	return { user, logout, login };
}

export const useKobble = (): KobbleClient => {
	const { kobble } = useContext(authContext);

	return kobble;
}
