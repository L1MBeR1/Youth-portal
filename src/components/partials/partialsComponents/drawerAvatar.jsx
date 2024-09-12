import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { logoutFunc } from '../../../utils/authUtils/logout.js';

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import DialogTitle from '@mui/joy/DialogTitle';
import Drawer from '@mui/joy/Drawer';
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import ModalClose from '@mui/joy/ModalClose';
import Stack from '@mui/joy/Stack';

import LogoutIcon from '@mui/icons-material/Logout';

import { Divider, Typography } from '@mui/joy';
import profileBlank from '../../../img/profileBlank.png';

function DrawerAvatar({ img, id, nickname, roles }) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
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
				display: { xs: 'block', mdx: 'none' },
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
				sx={{ display: { xs: 'inline-flex', mdx: 'none' } }}
				open={openDrawer}
				onClose={() => setOpenDrawer(false)}
			>
				<ModalClose />
				<DialogTitle>
					<Stack
						direction={'row'}
						spacing={2}
						alignItems={'center'}
						sx={{ maxWidth: '70%' }}
					>
						<Avatar size='lg' src={img || profileBlank} />

						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								maxWidth: '100%',
							}}
						>
							<Typography
								level='title-lg'
								sx={{
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									maxWidth: '100%',
								}}
							>
								{nickname}
							</Typography>
						</Box>
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
						{/* <PersonIcon /> */}
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
							{/* <PublishIcon /> */}
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
						{/* <SettingsIcon /> */}
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
