import React from 'react';
import LoginForm from '../components/forms/loginForm'
import Box from '@mui/joy/Box';

function Login() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '50px 10px',
      }}
    >
    <LoginForm/>
    </Box>
  );
}

export default Login;
