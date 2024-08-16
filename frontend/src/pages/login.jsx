import React from 'react';
import LoginForm from '../components/forms/loginForm';
import Box from '@mui/joy/Box';

function Login() {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexGrow: '1',
				mx: '15px',
			}}
		>
			<LoginForm />
		</Box>
	);
}

export default Login;
