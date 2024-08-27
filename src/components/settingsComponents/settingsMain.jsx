import React from 'react';
import { Sheet } from '@mui/joy';

import AccountSection from './sections/accountSection';
import PublicAccountSection from './sections/publicAccountSection';

function SettingsMain({ section }) {
	const getContent = section => {
		switch (section) {
			case 'account':
				return <AccountSection />;
			case 'public profile':
				return <PublicAccountSection />;
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
