// src/Layout.js
import React from 'react';
import Header from './header';
import Footer from './footer';

function Layout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
