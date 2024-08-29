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

import DrawerAvatar from './drawerAvatar.jsx';
import MenuAvatar from './menuAvatar.jsx';

import { Button, Typography } from '@mui/joy';

function HeaderProfile() {
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
				display: 'flex',
				flexGrow: 1,
				minWidth: '39px',
				justifyContent: 'center',
				alignContent: 'center',
			}}
		>
			{/* <CircularProgress color="neutral"size="sm" variant="solid" /> */}
			{isLoading ? (
				<CircularProgress
					color='neutral'
					size='sm'
					sx={{ '--CircularProgress-size': '30px' }}
				/>
			) : profileData ? (
				<>
					<DrawerAvatar
						img={profileData.profile_image_uri}
						id={profileData.user_id}
						roles={profileData.roles}
						nickname={profileData.nickname}
					/>
					<MenuAvatar
						img={profileData.profile_image_uri}
						id={profileData.user_id}
						roles={profileData.roles}
					/>
				</>
			) : (
				<Link to='/login'>
					<Box sx={{ display: { xs: 'none', md: 'block' } }}>
						<Button
							color={'primary'}
							sx={{
								borderRadius: '50px',
							}}
						>
							<Typography
								level={'headerButton'}
								textColor={'var(--joy-palette-staticColors-mainLight)'}
							>
								Войти в аккаунт
							</Typography>
						</Button>
					</Box>
					<Box sx={{ display: { xs: 'block', md: 'none' } }}>
						<IconButton
							size='lg'
							sx={{
								borderRadius: '10px',
							}}
						>
							<AccountCircleIcon />
						</IconButton>
					</Box>
				</Link>
			)}
		</Box>
	);
}
export default HeaderProfile;
