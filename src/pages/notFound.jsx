import { Button, Stack, Typography } from '@mui/joy';
import React from 'react';
import { useNavigate } from 'react-router-dom';
function NotFound() {
	const navigate = useNavigate();
	return (
		<Stack
			direction={'column'}
			justifyContent={'center'}
			alignItems={'center'}
			sx={{
				padding: { xs: '15px', sm: '40px' },
			}}
			spacing={3}
			flexGrow={1}
		>
			<Typography
				sx={{ fontSize: 'clamp(9rem, 17vw, 15rem)' }}
				level='title-md'
			>
				404
			</Typography>
			<Typography level='title-xxl'>
				Похоже, данная страница ещё не опубликована.
			</Typography>
			<Button
				onClick={() => {
					navigate('/');
				}}
			>
				Вернуться на главную
			</Button>
		</Stack>
	);
}

export default NotFound;
