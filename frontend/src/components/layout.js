// src/Layout.js
import React from 'react';

import Stack from '@mui/joy/Stack';

import Header from './partials/header';
import Footer from './partials/footer';

function Layout({ children }) {
  return (
    <Stack >
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </Stack>
  );
}

export default Layout;
