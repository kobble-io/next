'use client';

import { useAccessControl, useAssertWrappedByKobbleProvider } from '../context/hooks';

type PropsWithChildren<P> = P & { children?: React.ReactNode };

export const IsAllowed: React.FC<
	PropsWithChildren<{
		permission?: string[] | string;
		quota?: string[] | string;
	}>
> = ({ children, quota, permission }) => {
	useAssertWrappedByKobbleProvider(IsAllowed.name);

	const { hasPermission, hasRemainingQuota, isLoading } = useAccessControl();

	if (isLoading) {
		return null;
	}

	if (quota && !hasRemainingQuota(quota)) {
		return null;
	}

	if (permission && !hasPermission(permission)) {
		return null;
	}

	return <>{children}</>;
};
