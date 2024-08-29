import { Sheet } from '@mui/joy';
import React from 'react';

import AccountSection from './sections/accountSection';
import PublicAccountSection from './sections/publicAccountSection';
import SecuritySection from './sections/securitySecrion';

function SettingsMain({ section }) {
	const getContent = section => {
		switch (section) {
			case 'account':
				return <AccountSection />;
			case 'public profile':
				return <PublicAccountSection />;
			case 'security':
				return <SecuritySection />;
			default:
				return '';
		}
	};
	return (
		<Sheet
			sx={{
				flexGrow: 1,
				borderRadius: '30px',
				padding: '25px',
			}}
		>
			{getContent(section)}
		</Sheet>
	);
}

export default SettingsMain;
