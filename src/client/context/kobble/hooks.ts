import { useContext } from 'react';
import kobbleContext from './context';

export const useKobble = () => {
	const { kobble } = useContext(kobbleContext);

	return { kobble };
}

export const useAssertWrappedByKobbleProvider = (componentName: string) => {
	if (!useContext(kobbleContext)) {
		throw new Error(`${componentName} must be wrapped by a KobbleProvider`);
	}
}
