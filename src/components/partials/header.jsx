import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderProfile from './partialsComponents/headerProfile.jsx';

import { useColorScheme } from '@mui/joy/styles';

import Box from '@mui/joy/Box';
import DialogTitle from '@mui/joy/DialogTitle';
import Drawer from '@mui/joy/Drawer';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Tooltip from '@mui/joy/Tooltip';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import logo from '../../img/logo.png';
function ColorSchemeToggle() {
	const { mode, setMode } = useColorScheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);
	if (!mounted) {
		return <IconButton size='sm' variant='outlined' color='primary' />;
	}
	return (
		<Tooltip title='Change theme' variant='outlined'>
			<IconButton
				id='toggle-mode'
				size='sm'
				variant='plain'
				color='neutral'
				sx={{ alignSelf: 'center', display: { xs: 'none', md: 'inline-flex' } }}
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
		</Tooltip>
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
				sx={{
					display: 'flex',
					flexGrow: 1,
					justifyContent: 'space-between',
					alignItems: 'center',
					background: 'primary.main',
					paddingY: '5px',
					paddingX: { xs: '15px', sm: '20px' },
					height: '60px',
					// borderBottom: '1px solid',
					// borderColor: 'divider',
					position: 'fixed',
					top: 0,
					width: '100%',
					zIndex: 1100,
				}}
			>
				<Link to='/'>
					<Box paddingTop={'6px'}>
						<img width='200px' alt='logo' src={logo} />
						{/* <Typography level='h2'>LOGO</Typography> */}
					</Box>
				</Link>
				<Box
					sx={{
						display: { xs: 'inline-flex', md: 'none' },
					}}
				>
					<IconButton
						variant='plain'
						color='neutral'
						onClick={() => setOpen(true)}
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
							<Typography fontSize='40px' level='title-lg'>
								LOGO
							</Typography>
						</DialogTitle>
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
							>
								{' '}
								блоги
							</ListItemButton>
							<ListItemButton
								onClick={() => {
									handleLink('/news');
								}}
							>
								новости
							</ListItemButton>
							<ListItemButton
								onClick={() => {
									handleLink('/podcasts');
								}}
							>
								подкасты
							</ListItemButton>
						</List>
					</Drawer>
				</Box>
				<Stack
					direction='row'
					justifyContent='center'
					alignItems='center'
					spacing={2}
					sx={{
						display: { xs: 'none', md: 'flex' },
					}}
				>
					<Button
						color='neutral'
						variant='plain'
						sx={{
							borderRadius: '50px',
						}}
						onClick={() => {
							handleLink('/blogs');
						}}
					>
						<Typography
							fontSize={'clamp(0.75rem,1vw, 1.5rem)'}
							fontWeight={'700'}
						>
							блоги
						</Typography>
					</Button>
					<Button
						color='neutral'
						variant='plain'
						sx={{
							borderRadius: '50px',
						}}
						onClick={() => {
							handleLink('/news');
						}}
					>
						<Typography
							fontSize={'clamp(0.75rem,1vw, 1.5rem)'}
							fontWeight={'700'}
						>
							новости
						</Typography>
					</Button>
					<Button
						color='neutral'
						variant='plain'
						sx={{
							borderRadius: '50px',
						}}
						onClick={() => {
							handleLink('/podcasts');
						}}
					>
						<Typography
							fontSize={'clamp(0.75rem,1vw, 1.5rem)'}
							fontWeight={'700'}
						>
							подкасты
						</Typography>
					</Button>
				</Stack>
				<Stack
					direction='row'
					justifyContent='center'
					alignItems='center'
					spacing={1}
					height='100%'
					sx={{
						display: { xs: 'none', md: 'flex' },
					}}
				>
					{/* <ColorSchemeToggle /> */}
					<HeaderProfile />
				</Stack>
			</Sheet>
		</header>
	);
}
export default Header;