import Box from '@mui/joy/Box';
import React from 'react';
import LoginForm from '../components/forms/loginForm';

function Login() {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexGrow: '1',
				mx: '15px',
				minHeight: '70vh',
			}}
		>
			<LoginForm />
		</Box>
	);
}

export default Login;
