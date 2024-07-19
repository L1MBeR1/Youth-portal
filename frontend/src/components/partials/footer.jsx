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
            borderTop:'1px solid',
          borderColor: 'divider',
        }}
        >
           <Typography level="h2">Footer Content</Typography> 
        </Box>
    </footer>
  );
}
export default Footer;