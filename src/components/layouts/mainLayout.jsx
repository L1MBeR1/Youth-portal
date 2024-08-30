import React from 'react';

import Stack from '@mui/joy/Stack';

import { Outlet } from 'react-router-dom';
import '../../css/App.css';
import CookieAccept from '../modals/cookieAccept';
import Footer from '../partials/footer';
import Header from '../partials/header';

function MainLayout() {
	return (
		<Stack
			sx={{
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
