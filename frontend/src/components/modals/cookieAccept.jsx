import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/joy/Snackbar';
import Stack from '@mui/joy/Stack';
import { Button, Typography } from '@mui/joy';
import { getCookie, setCookie } from '../../utils/cookie/cookieUtils';

const CookieAccept = () => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const agreement = getCookie('cookieConsent');
		if (!agreement) {
			setTimeout(() => {
				setIsOpen(true);
			}, 2000);
		}
	}, []);

	const handleAccept = () => {
		setCookie('cookieConsent', 'true', 8760);
		setIsOpen(false);
	};

	return (
		<Snackbar
			anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			variant='plain'
			open={isOpen}
			size='lg'
			sx={{
				minWidth: { xs: '90%', lg: '70%', xl: 'auto' },
				padding: '25px',
				borderRadius: '30px',
				transition: 'transform 0.5s ease-in-out',
				transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
			}}
		>
			<Stack
				direction={'row'}
				justifyContent={'space-between'}
				flexGrow={'1'}
				spacing={{ xs: 2, mdx: 8 }}
				// sx={{
				// 	gap: '20px',
				// }}
			>
				<Stack spacing={0.3}>
					<Typography level='title-lg'>Мы используем cookie</Typography>
					<Typography level='body-md'>
						Продолжая использовать наш сайт, вы соглашаетесь на использование
						файлов cookie.
					</Typography>
				</Stack>
				<Stack direction='column' justifyContent={'center'}>
					<Button color='primary' variant='solid' onClick={handleAccept}>
						<Typography level='buttonInv'>Принять</Typography>
					</Button>
				</Stack>
			</Stack>
		</Snackbar>
	);
};

export default CookieAccept;
