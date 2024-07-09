import React from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import Layout from './components/layout';
import Home from './pages/home';
import Login from './pages/login';
import Registration from './pages/registration';
import Recovery from './pages/recovery';
import NotFound from './pages/notFound';
import Admin from './pages/admin';


import { CssBaseline } from '@mui/joy';
import { CssVarsProvider } from '@mui/joy/styles';

import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';
function App() {
  const PrivateRoute = ({ element, roles  }) => {
    const token = Cookies.get('token');
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded)
      if (roles.some(role => decoded.roles.includes(role))) {
        return element;
      }
    }
    return <Navigate to="/404" />;
  };

  return (
    <CssVarsProvider>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/recovery" element={<Recovery />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
            
            <Route path="/admin" element={<PrivateRoute element={<Admin /> } roles={['admin']}/>} />
          </Routes>
        </Layout>
      </Router>
    </CssVarsProvider>
  );
}

export default App;