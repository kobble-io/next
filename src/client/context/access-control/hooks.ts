import { useContext } from "react";
import { accessControlContext } from "./provider";

export const useAccessControl = () => useContext(accessControlContext);
