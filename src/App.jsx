import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import MainLayout from './components/layouts/mainLayout';
import WorkLayout from './components/layouts/workLayout';


import Home from './pages/home';
import Login from './pages/login';
import Registration from './pages/registration';
import Recovery from './pages/recovery';
import NotFound from './pages/notFound';

import Admin from './pages/admin';

// Для тестов
import BackendTestBlogList from './pages/BackendTestBlogList';
import BlogDetail from './components/backend_test/BlogDetail';


import './css/App.css'
import { CssBaseline } from '@mui/joy';
import { CssVarsProvider } from '@mui/joy/styles';

import { jwtDecode } from 'jwt-decode';
import { getCookie } from './cookie/cookieUtils';
function App() {
  const PrivateRoute = ({ element, roles }) => {
    const token = getCookie('token');
    if (token) {
      const decoded = jwtDecode(token);
      // console.log(decoded)
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
        <Routes>

          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="registration" element={<Registration />} />
            <Route path="recovery" element={<Recovery />} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />


            {/* Для тестов */}
            <Route path="bt" element={<BackendTestBlogList />}>
              <Route path=":id" element={<BlogDetail />} /> 
            </Route>
          </Route>

          <Route path="/admin" element={<PrivateRoute element={<Admin />} roles={['admin']} />} />

        </Routes>
      </Router>
    </CssVarsProvider>
  );
}

export default App;