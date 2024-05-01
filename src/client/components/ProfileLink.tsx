'use client';

import { AnchorHTMLAttributes, FC } from 'react';
import { useAssertWrappedByKobbleProvider } from '../context/hooks';
import env from '../env';

export const ProfileLink: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({ children, ...rest }) => {
	useAssertWrappedByKobbleProvider(ProfileLink.name);

	const url = new URL('/profile', env.domain).toString();

	return (
		<a href={url} {...rest}>
			{children}
		</a>
	);
};
