import React from 'react';

import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
function Footer() {
  return (
    <footer>
        <Box
        sx={{
            display:'flex',
            height:'20vh',
            alignItems:'center',
            justifyContent:'center',
            outline:'1px black solid',
        }}
        >
           <Typography level="h2">Footer Content</Typography> 
        </Box>
    </footer>
  );
}
export default Footer;