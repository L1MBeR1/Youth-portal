import React, { useState } from 'react';
import Snackbar from '@mui/joy/Snackbar';
import Stack from '@mui/joy/Stack';
import { Button, Typography } from '@mui/joy';

const CookieAccept = () => {
	const [isOpen, setIsOpen] = useState(true);

	const handleClose = () => {
		setIsOpen(false);
	};
	return (
		<Snackbar
			anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			open={isOpen}
		>
			<Stack direction={'row'}>
				<Stack>
					<Typography></Typography>
					<Typography></Typography>
				</Stack>
				<Button>Принять</Button>
			</Stack>
		</Snackbar>
	);
};
export default CookieAccept;
