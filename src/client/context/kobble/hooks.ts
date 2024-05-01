import { useContext } from 'react';
import kobbleContext, { KobbleContextType } from './context';

export const useKobble = () => {
	const ctx = useContext(kobbleContext) as KobbleContextType;

	if (!ctx) {
		throw new Error('useKobble must be used within a KobbleProvider');
	}

	const { kobble } = ctx;

	return { kobble };
}

export const useAssertWrappedByKobbleProvider = (componentName: string) => {
	if (!useContext(kobbleContext)) {
		throw new Error(`${componentName} must be wrapped by a KobbleProvider`);
	}
}
