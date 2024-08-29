import Box from '@mui/joy/Box';
import React from 'react';
import RegistrationForm from '../components/forms/registrationForm';

function Registration() {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexGrow: '1',
				margin: '20px 15px',
			}}
		>
			<RegistrationForm />
		</Box>
	);
}

export default Registration;
