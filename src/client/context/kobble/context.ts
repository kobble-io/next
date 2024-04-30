import { createContext } from "react";
import { KobbleClient } from "../../../api/kobble";
import { createClientSideKobble } from "../../kobble";

export type AccessControlContextType = {
	kobble: KobbleClient;
}

export default createContext({
	kobble: createClientSideKobble()
});
