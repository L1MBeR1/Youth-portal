import React from 'react';
import RegistrationForm from '../components/forms/registrationForm'
import Box from '@mui/joy/Box';

function Registration() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow:'1',
        margin:'20px 10px'
      }}
    >
      <RegistrationForm/>
    </Box>
  );
}

export default Registration;
