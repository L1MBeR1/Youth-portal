import React from 'react';

import Stack from '@mui/joy/Stack';

import Header from '../partials/header';
import Footer from '../partials/footer';
import { Outlet } from 'react-router-dom';
import CookieAccept from '../modals/cookieAccept';
import '../../css/App.css';

function MainLayout() {
	return (
		<Stack
			sx={{
				background: 'var(--joy-palette-neutral-main)',
				minHeight: '100vh',
				paddingTop: '60px',
			}}
		>
			<Header />
			<main className='layout-main'>
				<Outlet />
			</main>
			<CookieAccept />
			<Footer />
		</Stack>
	);
}

export default MainLayout;
