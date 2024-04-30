import { createContext } from "react";
import { Permission, Quota } from "../../../api/types";

export type AccessControlContextType = {
	permissions: Permission[];
	quotas: Quota[];
	hasPermission: (permissionNames: string[] | string) => boolean;
	hasRemainingQuota: (quotaNames: string[] | string) => boolean;
	isLoading: boolean;
	error: Error | null;
}

export default createContext<AccessControlContextType>({
	permissions: [],
	quotas: [],
	hasPermission: () => false,
	hasRemainingQuota: () => false,
	isLoading: true,
	error: null
});
