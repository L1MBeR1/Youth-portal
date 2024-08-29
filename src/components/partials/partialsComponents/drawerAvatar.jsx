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
import PublishIcon from '@mui/icons-material/Publish';

import profileBlank from '../../../img/profileBlank.png';
import { Button, Divider, Typography } from '@mui/joy';

function DrawerAvatar({ img, id, nickname, roles }) {
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
		setOpenDrawer(false);
	};

	return (
		<Box
			sx={{
				display: { xs: 'block', md: 'none' },
			}}
		>
			<Avatar
				size='md'
				src={img || profileBlank}
				sx={{ cursor: 'pointer' }}
				onClick={() => {
					setOpenDrawer(true);
				}}
			/>
			<Drawer
				anchor='right'
				sx={{ display: { xs: 'inline-flex', md: 'none' } }}
				open={openDrawer}
				onClose={() => setOpenDrawer(false)}
			>
				<ModalClose />
				<DialogTitle>
					<Stack direction={'row'} spacing={2} alignItems={'center'}>
						<Avatar size='lg' src={img || profileBlank} />
						<Typography level='title-lg'>{nickname}</Typography>
					</Stack>
				</DialogTitle>
				<Stack></Stack>
				<List
					size='lg'
					component='nav'
					sx={{
						flex: 'none',
						fontSize: 'lg',
					}}
				>
					<ListItemButton
						onClick={() => {
							handleLink(`/profile/${id}`);
						}}
						sx={theme => ({
							color: `${theme.vars.palette.neutral['second']}`,
						})}
					>
						<PersonIcon />
						Профиль
					</ListItemButton>
					{(roles.includes('blogger') || roles.includes('news_creator')) && (
						<ListItemButton
							onClick={() => {
								handleLink('/my-content');
							}}
							sx={theme => ({
								color: `${theme.vars.palette.neutral['second']}`,
							})}
						>
							<PublishIcon />
							Мой контент
						</ListItemButton>
					)}
					<ListItemButton
						onClick={() => {
							handleLink('/settings');
						}}
						sx={theme => ({
							color: `${theme.vars.palette.neutral['second']}`,
						})}
					>
						<SettingsIcon />
						Настройки
					</ListItemButton>
					{roles.includes('admin') && (
						<ListItemButton
							onClick={() => {
								handleLink('/admin');
							}}
							sx={theme => ({
								color: `${theme.vars.palette.neutral['second']}`,
							})}
						>
							Панель админа
						</ListItemButton>
					)}
					{roles.includes('superuser') && (
						<ListItemButton
							onClick={() => {
								handleLink('/superuser');
							}}
							sx={theme => ({
								color: `${theme.vars.palette.neutral['second']}`,
							})}
						>
							Панель суперюзера
						</ListItemButton>
					)}
					{roles.includes('moderator') && (
						<ListItemButton
							onClick={() => {
								handleLink('/moderator');
							}}
							sx={theme => ({
								color: `${theme.vars.palette.neutral['second']}`,
							})}
						>
							Панель модератора
						</ListItemButton>
					)}
					<Divider></Divider>
					<ListItemButton
						onClick={handleLogout}
						color='danger'
						sx={theme => ({
							color: `${theme.vars.palette.neutral['second']}`,
						})}
					>
						<LogoutIcon />
						Выйти
					</ListItemButton>
				</List>
			</Drawer>
		</Box>
	);
}

export default DrawerAvatar;
