import React, {useState}from 'react';

import Card from '@mui/joy/Card';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import FormHelperText from '@mui/joy/FormHelperText';
import IconButton from '@mui/joy/IconButton';

import AdminSidebar from '../components/pageComponents/adminPage/adminSidebar';
import AdminMain from '../components/pageComponents/adminPage/adminMain';
function Admin() {
  const [section, setSection] = useState('statistics');
  return (
    <Stack
    direction="row"
    sx={{
      flexGrow:1,
      overflow:'hidden',
    }}
    >
      <AdminSidebar
      selectedSection={section} 
      setSection={setSection}
      />
      <AdminMain
      section={section}
      />
    </Stack>
  );
}

export default Admin;