import React, { useState } from 'react';

import SettingsMain from '../components/settingsComponents/settingsMain';
import SettingsSidebar from '../components/settingsComponents/settingsSidebar';

import { Stack, Box } from '@mui/joy';
import { mainMargin } from '../themes/mainMargin';
function Settings() {
	const [section, setSection] = useState('account');
	return (
		<Stack
			direction={'row'}
			spacing={'20px'}
			sx={{
				marginX: mainMargin,
				marginTop: '40px',
			}}
		>
			<SettingsSidebar selectedSection={section} setSection={setSection} />
			<SettingsMain section={section} />
		</Stack>
	);
}

export default Settings;
