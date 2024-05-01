'use client';

import React, { PropsWithChildren } from 'react';
import { defaultButtonIfNoChild } from './utils/defaultButtonIfNoChild';
import { LogoutButton } from './LogoutButton';
import { useRouter } from 'next/navigation';
import { routes } from '../../constants';
import { useAssertWrappedByKobbleProvider } from '../context/hooks';
import { assertSingleChild } from './utils/assertSingleChild';
import { executeFunctionSafely } from './utils/executeFunctionSafely';

export const LoginButton: React.FC<PropsWithChildren> = ({ children, ...rest }) => {
	useAssertWrappedByKobbleProvider(LogoutButton.name);

	const router = useRouter();

	const defaultChildren = defaultButtonIfNoChild(children, 'Login');
	const child = assertSingleChild(LogoutButton.name, defaultChildren);

	const ourClickHandler = async () => {
		await executeFunctionSafely((child as any).props.onClick);

		router.push(routes.login);
	};

	const childProps = { ...rest, onClick: ourClickHandler };

	return React.cloneElement(child as React.ReactElement<unknown>, childProps);
};
