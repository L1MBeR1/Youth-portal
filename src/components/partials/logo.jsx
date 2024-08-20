import React from 'react';
import { useColorScheme } from '@mui/joy/styles';
import logoLight from '../../img/logoLight.svg';
import logoDark from '../../img/logoDark.svg';

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
