import {
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemContent,
	Sheet,
	Typography,
} from '@mui/joy';
import React from 'react';

import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PortraitIcon from '@mui/icons-material/Portrait';
import ShieldIcon from '@mui/icons-material/Shield';

function SettingsSidebar({ selectedSection, setSection }) {
	const handleSetSection = section => {
		setSection(section);
	};
	return (
		<Sheet
			sx={{
				borderRadius: '30px',
				padding: '25px',
				minWidth: '300px',
			}}
		>
			<Box
				sx={{
					marginLeft: '5px',
				}}
			>
				<Typography level='title-lg'>Настройки</Typography>
			</Box>
			<List
				size='sm'
				sx={{
					marginTop: '10px',
					gap: 1,
					'--List-nestedInsetStart': '30px',
					'--ListItem-radius': theme => theme.vars.radius.sm,
				}}
			>
				<ListItem>
					<ListItemButton
						selected={selectedSection === 'account'}
						onClick={() => handleSetSection('account')}
					>
						<ManageAccountsIcon />
						<ListItemContent>
							<Typography level='body-md'>Аккаунт</Typography>
						</ListItemContent>
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton
						selected={selectedSection === 'public profile'}
						onClick={() => handleSetSection('public profile')}
					>
						<PortraitIcon />
						<ListItemContent>
							<Typography level='body-md'>Публичный профиль</Typography>
						</ListItemContent>
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton
						selected={selectedSection === 'security'}
						onClick={() => handleSetSection('security')}
					>
						<ShieldIcon />
						<ListItemContent>
							<Typography level='body-md'>Безопасность</Typography>
						</ListItemContent>
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton
						disabled
						selected={selectedSection === 'notifications'}
						onClick={() => handleSetSection('notifications')}
					>
						<NotificationsIcon />
						<ListItemContent>
							<Typography level='body-md'>Уведомления</Typography>
						</ListItemContent>
					</ListItemButton>
				</ListItem>
			</List>
		</Sheet>
	);
}

export default SettingsSidebar;
