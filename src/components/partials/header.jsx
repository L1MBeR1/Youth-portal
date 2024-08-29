import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './logo.jsx'; // Импортируем новый компонент
import HeaderProfile from './partialsComponents/headerProfile.jsx';

import { useColorScheme } from '@mui/joy/styles';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import DialogTitle from '@mui/joy/DialogTitle';
import Drawer from '@mui/joy/Drawer';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

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
				display: { xs: 'none', md: 'inline-flex' },
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
					boxShadow: 'xs',
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
					zIndex: 1100,
				}}
			>
				<Box
					sx={{
						display: { xs: 'inline-flex', md: 'none' },
					}}
				>
					<IconButton
						variant='plain'
						color='neutral'
						onClick={() => setOpen(true)}
						size='lg'
						sx={theme => ({
							borderRadius: '10px',
							color: `${theme.vars.palette.neutral['second']}`,
						})}
					>
						<MenuRoundedIcon />
					</IconButton>
					<Drawer
						sx={{ display: { xs: 'inline-flex', md: 'none' } }}
						open={open}
						onClose={() => setOpen(false)}
					>
						<ModalClose />
						<DialogTitle>
							<Logo />
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
					sx={{ justifySelf: 'center', display: { xs: 'none', md: 'flex' } }}
				>
					<Stack
						direction='row'
						justifyContent='center'
						alignItems='center'
						spacing={1}
					>
						<Button
							variant='plain'
							onClick={() => {
								handleLink('/blogs');
							}}
						>
							<Typography level={'headerButton'}>Блоги</Typography>
						</Button>
						<Button
							variant='plain'
							onClick={() => {
								handleLink('/news');
							}}
						>
							<Typography level={'headerButton'}>Новости</Typography>
						</Button>
						<Button
							variant='plain'
							onClick={() => {
								handleLink('/podcasts');
							}}
						>
							<Typography level={'headerButton'}>Подкасты</Typography>
						</Button>
						<Button
							variant='plain'
							onClick={() => {
								handleLink('/events');
							}}
						>
							<Typography level={'headerButton'}>Мероприятия</Typography>
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
