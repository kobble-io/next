'use client';

import { AnchorHTMLAttributes, FC } from 'react';
import { useAssertWrappedByKobbleProvider } from '../context/hooks';
import env from '../env';

export const PricingLink: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({ children, ...rest }) => {
	useAssertWrappedByKobbleProvider(PricingLink.name);

	const url = new URL('/pricing', env.domain).toString();

	return (
		<a href={url} {...rest}>
			{children}
		</a>
	);
};
