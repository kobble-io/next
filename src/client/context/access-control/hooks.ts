import { useContext } from "react";
import accessControlContext from "./context";

export const useAccessControl = () => useContext(accessControlContext);
