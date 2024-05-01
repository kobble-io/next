'use client';

import { AnchorHTMLAttributes } from 'react';
import { useAssertWrappedByKobbleProvider } from '../context/hooks';
import env from '../env';

export const PortalLink: React.FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({ children, ...rest }) => {
	useAssertWrappedByKobbleProvider(PortalLink.name);

	return (
		<a href={env.domain} {...rest}>
			{children}
		</a>
	);
};
