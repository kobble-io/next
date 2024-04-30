import { useContext } from 'react';
import kobbleContext from './context';

export const useKobble = () => {
	const { kobble } = useContext(kobbleContext);

	return { kobble };
}
