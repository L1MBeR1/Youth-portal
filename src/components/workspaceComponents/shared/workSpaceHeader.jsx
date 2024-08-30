import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderProfile from '../../partials/partialsComponents/headerProfile';

import { useColorScheme } from '@mui/joy/styles';

import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Tooltip from '@mui/joy/Tooltip';

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import logoDark from '../../../img/logoDark.svg';
import logoLight from '../../../img/logoLight.svg';
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

function Header({ setOpen, open }) {
	const { mode, systemMode } = useColorScheme();
	const getLogo = () => {
		if (systemMode) {
			return systemMode === 'light' ? logoDark : logoLight;
		}
		return mode === 'light' ? logoDark : logoLight;
	};
	return (
		<header>
			<Sheet
				sx={{
					display: 'flex',
					flexGrow: 1,
					justifyContent: 'space-between',
					alignItems: 'center',
					background: 'var(--joy-palette-main-background)',
					padding: '5px 20px',
					borderBottom: '1px solid',
					borderColor: 'divider',
				}}
			>
				<Box sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
					<IconButton
						variant='outlined'
						color='neutral'
						onClick={() => setOpen(!open)}
					>
						<MenuRoundedIcon />
					</IconButton>
				</Box>
				<Link to='/'>
					<Box paddingTop={'6px'}>
						<img width='180px' alt='logo' src={getLogo()} />
					</Box>
				</Link>
				<Stack
					direction='row'
					justifyContent='center'
					alignItems='center'
					spacing={1}
					height='100%'
				>
					<ColorSchemeToggle />
					<HeaderProfile />
				</Stack>
			</Sheet>
		</header>
	);
}
export default Header;
