import React from 'react';

import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PortraitIcon from '@mui/icons-material/Portrait';
import ShieldIcon from '@mui/icons-material/Shield';
import {
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemContent,
	Sheet,
	Stack,
	Typography,
} from '@mui/joy';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { mainMargin } from '../themes/margins';
function Settings() {
	const navigate = useNavigate();
	const location = useLocation();
	const handleNavigate = path => {
		navigate(path);
	};
	const isActive = path => location.pathname.startsWith(path);

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
							selected={isActive('/settings/account')}
							onClick={() => handleNavigate('/settings/account')}
						>
							<ManageAccountsIcon />
							<ListItemContent>
								<Typography level='body-md'>Аккаунт</Typography>
							</ListItemContent>
						</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton
							selected={isActive('/settings/public')}
							onClick={() => handleNavigate('/settings/public')}
						>
							<PortraitIcon />
							<ListItemContent>
								<Typography level='body-md'>Публичный профиль</Typography>
							</ListItemContent>
						</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton
							selected={isActive('/settings/security')}
							onClick={() => handleNavigate('/settings/security')}
						>
							<ShieldIcon />
							<ListItemContent>
								<Typography level='body-md'>Безопасность</Typography>
							</ListItemContent>
						</ListItemButton>
					</ListItem>
					{/* <ListItem>
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
				</ListItem> */}
				</List>
			</Sheet>
			<Sheet
				sx={{
					flexGrow: 1,
					borderRadius: '30px',
					padding: '25px',
				}}
			>
				<Outlet />
			</Sheet>
		</Stack>
	);
}

export default Settings;
