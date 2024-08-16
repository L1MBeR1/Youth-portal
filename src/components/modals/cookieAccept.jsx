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
			open={isOpen}
			size='lg'
			sx={{
				minWidth: { xs: '90%', lg: '70%', xl: 'auto' },
				padding: '20px 30px',
				borderRadius: '30px',
				transition: 'transform 0.5s ease-in-out',
				transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
			}}
		>
			<Stack
				direction={'row'}
				justifyContent={'space-between'}
				flexGrow={'1'}
				spacing={8}
				// sx={{
				// 	gap: '20px',
				// }}
			>
				<Stack>
					<Typography level='title-lg'>Мы используем cookie</Typography>
					<Typography>
						Продолжая использовать наш сайт, вы соглашаетесь на использование
						файлов cookie.
					</Typography>
				</Stack>
				<Stack direction='column' justifyContent={'center'}>
					<Button color='neutral' variant='solid' onClick={handleAccept}>
						<Typography
							sx={theme => ({
								color: `${theme.vars.palette.neutral['main']}`,
							})}
						>
							Принять
						</Typography>
					</Button>
				</Stack>
			</Stack>
		</Snackbar>
	);
};

export default CookieAccept;
