import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { logoutFunc } from '../../../utils/authUtils/logout.js';

import Avatar from '@mui/joy/Avatar';

import Box from '@mui/joy/Box';
import Dropdown from '@mui/joy/Dropdown';
import ListDivider from '@mui/joy/ListDivider';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';

import LogoutIcon from '@mui/icons-material/Logout';

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
	const myContentLink = roles.includes('blogger')
		? '/my-content/blogs'
		: roles.includes('news_creator')
		? '/my-content/news'
		: '/my-content';
	return (
		<Box
			sx={{
				display: { xs: 'none', mdx: 'block' },
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
					<Avatar size='lg' variant='outlined' src={img || profileBlank} />
				</MenuButton>
				<Menu
					size='sm'
					placement='bottom-end'
					variant='plain'
					sx={{ boxShadow: 'sm' }}
				>
					<MenuItem
						onClick={() => {
							handleLink(`/profile/${id}`);
						}}
					>
						{/* <PersonIcon /> */}
						Профиль
					</MenuItem>
					{(roles.includes('blogger') || roles.includes('news_creator')) && (
						<MenuItem
							onClick={() => {
								handleLink(myContentLink);
							}}
						>
							{/* <PublishIcon /> */}
							Мой контент
						</MenuItem>
					)}
					<MenuItem
						onClick={() => {
							handleLink(`/settings`);
						}}
					>
						{/* <SettingsIcon /> */}
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
