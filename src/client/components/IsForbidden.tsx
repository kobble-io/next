'use client';

import { FC } from 'react';
import { useAccessControl, useAssertWrappedByKobbleProvider } from '../context/hooks';

type PropsWithChildren<P> = P & { children?: React.ReactNode };

export const IsForbidden: FC<
	PropsWithChildren<{
		permission?: string[] | string;
		quota?: string[] | string;
	}>
> = ({ children, quota, permission }) => {
	useAssertWrappedByKobbleProvider(IsForbidden.name);

	const { hasPermission, hasRemainingQuota, isLoading } = useAccessControl();

	if (isLoading) {
		return null;
	}

	if (quota && !hasRemainingQuota(quota)) {
		return <>{children}</>;
	}

	if (permission && !hasPermission(permission)) {
		return <>{children}</>;
	}

	return null;
};
