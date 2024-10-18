import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './logo.jsx'; // Импортируем новый компонент
import HeaderProfile from './partialsComponents/headerProfile.jsx';

import { useColorScheme } from '@mui/joy/styles';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import DialogTitle from '@mui/joy/DialogTitle';
import Drawer from '@mui/joy/Drawer';
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

function ColorSchemeToggle() {
	const { mode, setMode } = useColorScheme();
	const [mounted, setMounted] = useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <IconButton size='sm' variant='outlined' color='primary' />;
	}

	return (
		<IconButton
			id='toggle-mode'
			size='sm'
			variant='plain'
			sx={{
				alignSelf: 'center',
				display: 'inline-flex',
			}}
			onClick={() => {
				if (mode === 'light') {
					setMode('dark');
				} else {
					setMode('light');
				}
			}}
		>
			{mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
		</IconButton>
	);
}

function Header() {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);

	const handleLink = link => {
		navigate(link);
		setOpen(false);
	};

	return (
		<header>
			<Sheet
				color='neutral'
				sx={{
					boxShadow: 'sm',
					display: 'grid',
					gridTemplateColumns: '1fr auto 1fr',
					alignItems: 'center',
					paddingY: '5px',
					paddingX: { xs: '15px', sm: '40px' },
					height: '60px',
					background: 'var(--joy-palette-main-background)',
					position: 'fixed',
					top: 0,
					width: '100%',
					zIndex: 1000,
				}}
			>
				<Box
					sx={{
						display: { xs: 'inline-flex', mdx: 'none' },
					}}
				>
					<IconButton
						variant='plain'
						color='neutral'
						onClick={() => setOpen(true)}
						size='md'
						sx={theme => ({
							borderRadius: '10px',
							color: `${theme.vars.palette.neutral['second']}`,
						})}
					>
						<MenuRoundedIcon />
					</IconButton>
					<Drawer
						sx={{ display: { xs: 'inline-flex', mdx: 'none' } }}
						open={open}
						onClose={() => setOpen(false)}
					>
						<ModalClose />
						<DialogTitle>
							<Logo size='180px' />
						</DialogTitle>
						<Stack></Stack>
						<List
							size='lg'
							component='nav'
							sx={{
								flex: 'none',
								fontSize: 'xl',
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
							<ListItemButton
								onClick={() => {
									handleLink('/projects');
								}}
								sx={theme => ({
									color: `${theme.vars.palette.neutral['second']}`,
								})}
							>
								Проекты
							</ListItemButton>
							<ListItemButton
								onClick={() => {
									handleLink('/organizations');
								}}
								sx={theme => ({
									color: `${theme.vars.palette.neutral['second']}`,
								})}
							>
								Организации
							</ListItemButton>
						</List>
					</Drawer>
				</Box>
				<Box sx={{ justifySelf: 'start' }}>
					<Link to='/'>
						<Box paddingTop={'6px'}>
							<Logo />
						</Box>
					</Link>
				</Box>
				<Box
					sx={{ justifySelf: 'center', display: { xs: 'none', mdx: 'flex' } }}
				>
					<Stack
						direction='row'
						justifyContent='center'
						alignItems='center'
						spacing={1}
					>
						{/* <Button
							variant='plain'
							onClick={() => {
								handleLink('/blogs');
							}}
						>
							<Typography level={'headerButton'}>Блоги</Typography>
						</Button> */}
						<Dropdown>
							<MenuButton
								slots={{ root: Button }}
								slotProps={{ root: { variant: 'plain' } }}
								endDecorator={<ArrowDropDown />}
								sx={{
									cursor: 'pointer',
								}}
							>
								<Typography level={'headerButton'}>Публикации </Typography>
							</MenuButton>
							<Menu
								placement='bottom'
								variant='plain'
								sx={{ boxShadow: 'sm' }}
								size='md'
							>
								<MenuItem
									onClick={() => {
										handleLink('/blogs');
									}}
								>
									Блоги
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleLink('/podcasts');
									}}
								>
									Подкасты
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleLink('/news');
									}}
								>
									Новости
								</MenuItem>
							</Menu>
						</Dropdown>
						<Button
							variant='plain'
							onClick={() => {
								handleLink('/events');
							}}
						>
							<Typography level={'headerButton'}>Мероприятия</Typography>
						</Button>
						<Button
							variant='plain'
							onClick={() => {
								handleLink('/projects');
							}}
						>
							<Typography level={'headerButton'}>Проекты</Typography>
						</Button>
						<Button
							variant='plain'
							onClick={() => {
								handleLink('/organizations');
							}}
						>
							<Typography level={'headerButton'}>Организации</Typography>
						</Button>
					</Stack>
				</Box>
				<Box sx={{ justifySelf: 'end' }}>
					<Stack
						direction='row'
						justifyContent='center'
						alignItems='center'
						spacing={1.5}
						height='100%'
					>
						<ColorSchemeToggle />
						<HeaderProfile />
					</Stack>
				</Box>
			</Sheet>
		</header>
	);
}

export default Header;
