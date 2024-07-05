// src/Layout.js
import React from 'react';
import Header from './partials/header';
import Footer from './partials/footer';

function Layout({ children }) {
  return (
    <div className='layout'>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
