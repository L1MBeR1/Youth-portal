import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { logoutFunc } from '../../../utils/authUtils/logout.js';

import Avatar from '@mui/joy/Avatar';

import Dropdown from '@mui/joy/Dropdown';
import ListDivider from '@mui/joy/ListDivider';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Box from '@mui/joy/Box';

import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

import profileBlank from '../../../img/profileBlank.png';

function MenuAvatar({ id, img, roles }) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

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
				display: { xs: 'none', md: 'block' },
			}}
		>
			<Dropdown>
				<MenuButton
					slots={{ root: Avatar }}
					slotProps={{ root: { color: 'neutral' } }}
					sx={{
						cursor: 'pointer',
					}}
				>
					<Avatar size='lg' src={img || profileBlank} />
				</MenuButton>
				<Menu size='sm' placement='bottom-end' variant='plain'>
					<MenuItem
						onClick={() => {
							handleLink(`/profile/${id}`);
						}}
					>
						<PersonIcon />
						Профиль
					</MenuItem>
					<MenuItem
						onClick={() => {
							handleLink(`/settings`);
						}}
					>
						<SettingsIcon />
						Настройки
					</MenuItem>
					{roles.includes('admin') && (
						<MenuItem
							onClick={() => {
								handleLink('/admin');
							}}
						>
							Панель админа
						</MenuItem>
					)}
					{roles.includes('superuser') && (
						<MenuItem
							onClick={() => {
								handleLink('/superuser');
							}}
						>
							Панель суперюзера
						</MenuItem>
					)}
					{roles.includes('moderator') && (
						<MenuItem
							onClick={() => {
								handleLink('/moderator');
							}}
						>
							Панель модератора
						</MenuItem>
					)}
					<ListDivider />
					<MenuItem onClick={handleLogout} variant='soft' color='danger'>
						<LogoutIcon />
						Выйти
					</MenuItem>
				</Menu>
			</Dropdown>
		</Box>
	);
}
export default MenuAvatar;
