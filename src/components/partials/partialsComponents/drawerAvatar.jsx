import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useProfile from '../../../hooks/useProfile.js';

import { logoutFunc } from '../../../utils/authUtils/logout.js';

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import ListDivider from '@mui/joy/ListDivider';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import ModalClose from '@mui/joy/ModalClose';
import Stack from '@mui/joy/Stack';
import DialogTitle from '@mui/joy/DialogTitle';
import Drawer from '@mui/joy/Drawer';

import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

import profileBlank from '../../../img/profileBlank.png';
import { Button, Typography } from '@mui/joy';

function DrawerAvatar({ img }) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { data: profileData, isLoading } = useProfile();
	const [openDrawer, setOpenDrawer] = useState(false);

	const handleLogout = async () => {
		await logoutFunc();

		queryClient.removeQueries(['profile']);
		navigate('/login');
	};

	const handleLink = link => {
		navigate(link);
	};

	return (
		<Box
			sx={{
				display: { xs: 'block', md: 'none' },
			}}
		>
			<Avatar size='lg' src={img || profileBlank} />
			<Drawer
				sx={{ display: { xs: 'inline-flex', md: 'none' } }}
				open={openDrawer}
				onClose={() => setOpenDrawer(false)}
			>
				<ModalClose />
				<DialogTitle></DialogTitle>
				<Stack></Stack>
				<List
					size='lg'
					component='nav'
					sx={{
						flex: 'none',
						fontSize: 'xl',
						'& > div': { justifyContent: 'center' },
					}}
				>
					<ListItemButton
						onClick={() => {
							handleLink('/blogs');
						}}
						sx={theme => ({
							color: `${theme.vars.palette.neutral['second']}`,
						})}
					>
						Блоги
					</ListItemButton>
					<ListItemButton
						onClick={() => {
							handleLink('/news');
						}}
						sx={theme => ({
							color: `${theme.vars.palette.neutral['second']}`,
						})}
					>
						Новости
					</ListItemButton>
					<ListItemButton
						onClick={() => {
							handleLink('/podcasts');
						}}
						sx={theme => ({
							color: `${theme.vars.palette.neutral['second']}`,
						})}
					>
						Подкасты
					</ListItemButton>
					<ListItemButton
						onClick={() => {
							handleLink('/events');
						}}
						sx={theme => ({
							color: `${theme.vars.palette.neutral['second']}`,
						})}
					>
						Мероприятия
					</ListItemButton>
				</List>
			</Drawer>
		</Box>
	);
}

export default DrawerAvatar;
