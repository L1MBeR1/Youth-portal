import Box from '@mui/joy/Box';
import React from 'react';
import RecoveryForm from '../components/forms/recoveryForm';
function Recovery() {
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
			<RecoveryForm />
		</Box>
	);
}
export default Recovery;
