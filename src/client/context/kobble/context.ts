import { createContext } from "react";
import { KobbleClient } from "../../../api/kobble";

export type KobbleContextType = {
	kobble: KobbleClient;
}

export default createContext<KobbleContextType | null>(null);
