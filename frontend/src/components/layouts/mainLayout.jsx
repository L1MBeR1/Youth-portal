import React from 'react';

import Stack from '@mui/joy/Stack';

import Header from '../partials/header';
import Footer from '../partials/footer';
import { Outlet } from 'react-router-dom';

import '../../css/App.css'

function MainLayout() {
  return (
    <Stack 
    sx={{
      minHeight:'100vh',
      paddingTop:'50px'
    }}
    >
      <Header />
      <main className='layout-main'
      >
      <Outlet/>
      </main>
      <Footer />
    </Stack>
  );
}

export default MainLayout;
