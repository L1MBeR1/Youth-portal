import { useColorScheme } from '@mui/joy/styles';
import React from 'react';
import logoDark from '../../img/logoDark.svg';
import logoLight from '../../img/logoLight.svg';

function Logo({ isInvert = false, size = '180px' }) {
	const { mode, systemMode } = useColorScheme();

	const getLogo = () => {
		const effectiveMode = systemMode || mode;
		const isLightMode = effectiveMode === 'light';

		if (isInvert) {
			return isLightMode ? logoLight : logoDark;
		}
		return isLightMode ? logoDark : logoLight;
	};

	return <img width={size} alt='logo' src={getLogo()} />;
}

export default Logo;
