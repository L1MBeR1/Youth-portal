import React, { useState } from 'react';

import SettingsMain from '../components/settingsComponents/settingsMain';
import SettingsSidebar from '../components/settingsComponents/settingsSidebar';

import { Stack } from '@mui/joy';
import { mainMargin } from '../themes/mainMargin';
function Settings() {
	const [section, setSection] = useState('account');
	return (
		<Stack
			sx={{
				minHeight: '85vh',
				flexDirection: { xs: 'column', md: 'row' },
				marginX: mainMargin,
				marginTop: '40px',
				gap: '20px',
			}}
		>
			<SettingsSidebar selectedSection={section} setSection={setSection} />
			<SettingsMain section={section} />
		</Stack>
	);
}

export default Settings;
