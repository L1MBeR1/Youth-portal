import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
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

import LogoutIcon from '@mui/icons-material/Logout';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

import profileBlank from '../../../img/profileBlank.png';
import { Button, Typography } from '@mui/joy';

function HeaderProfile() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { data: profileData, isLoading } = useProfile();

	const handleLogout = async () => {
		await logoutFunc();

		queryClient.removeQueries(['profile']);
		navigate('/login');
	};
	const profileMenu = () => {
		return (
			<Dropdown>
				<MenuButton
					slots={{ root: Avatar }}
					slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
					sx={{
						cursor: 'pointer',
					}}
				>
					<Avatar
						size='lg'
						src={profileData.profile_image_uri || profileBlank}
					/>
				</MenuButton>
				<Menu size='sm' placement='bottom-end'>
					<MenuItem component={Link} to={`/profile/${profileData.user_id}`}>
						<PersonIcon />
						Профиль
					</MenuItem>
					{profileData.roles.includes('admin') && (
						<MenuItem component={Link} to='/admin'>
							Панель админа
						</MenuItem>
					)}
					{profileData.roles.includes('superuser') && (
						<MenuItem component={Link} to='/superuser'>
							Панель суперюзера
						</MenuItem>
					)}
					{profileData.roles.includes('moderator') && (
						<MenuItem component={Link} to='/moderator'>
							Панель модератора
						</MenuItem>
					)}
					<MenuItem>
						<SettingsIcon />
						Настройки
					</MenuItem>
					<ListDivider />
					<MenuItem onClick={handleLogout} variant='soft' color='danger'>
						<LogoutIcon />
						Выйти
					</MenuItem>
				</Menu>
			</Dropdown>
		);
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
					variant='solid'
					sx={{ '--CircularProgress-size': '30px' }}
				/>
			) : profileData ? (
				<>{profileMenu()}</>
			) : (
				<Link to='/login'>
					<Button
						color='neutral'
						sx={{
							borderRadius: '50px',
							backgroundColor: 'black',
						}}
					>
						<Typography
							fontSize={'clamp(0.75rem,1vw, 1.5rem)'}
							fontWeight={'700'}
							textColor={'white'}
						>
							Войти в аккаунт
						</Typography>
					</Button>
				</Link>
			)}
		</Box>
	);
}
export default HeaderProfile;
