import React from 'react';

import Stack from '@mui/joy/Stack';

import Header from '../partials/header';
import { Outlet } from 'react-router-dom';
import '../../css/App.css'

function WorkLayout() {
  return (
    <Stack 
    sx={{
      minHeight:'100vh',
      overflow:'hidden',
      maxHeight:'100vh',
    }}
    >
      <Header />
      <main className='layout-main'
      >
       <Outlet/>
      </main>
    </Stack>
  );
}

export default WorkLayout;
