import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import MainLayout from './components/layouts/mainLayout';
import WorkLayout from './components/layouts/workLayout';

import Home from './pages/home';
import Login from './pages/login';
import Registration from './pages/registration';
import Recovery from './pages/recovery';
import NotFound from './pages/notFound';
import Profile from './pages/profile';

import Admin from './pages/admin';
import Moderator from './pages/moderator';
import Su from './pages/su';

// Для тестов
import BackendTestBlogList from './pages/BackendTestBlogList';
import BlogDetail from './components/backend_test/BlogDetail';


import './css/App.css'
import { CssBaseline } from '@mui/joy';
import { CssVarsProvider } from '@mui/joy/styles';

import { jwtDecode } from 'jwt-decode';
import { getToken } from './localStorage/tokenStorage';
import { getProfile } from './api/authApi';
function App() {


  // console.log('PR', getProfile());

  const PrivateRoute = ({ element, roles }) => {
    const token = getToken();
    if (token) {
      const decoded = jwtDecode(token);
       console.log(decoded)
      if (roles.some(role => decoded.roles.includes(role))) {
        return element;
      }
    }
    return <Navigate to="/404" />;
  };
  const GuestRoute = ({ element }) => {
    const token = getToken();
    if (!token) {
        return element;
    }
    return <Navigate to="/404" />;
  };
  const NotGuestRoute = ({ element }) => {
    const token = getToken();
    if (token) {
        const decoded = jwtDecode(token);
        if (decoded.roles)
        {
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
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />

            {/* Пути только для гостя */}
            <Route path="login" element={<GuestRoute element={<Login />}/>} />
            <Route path="registration" element={<GuestRoute element={<Registration />}/>} />
            <Route path="recovery" element={<GuestRoute element={<Recovery />}/>} />

            {/* Пути не для гостя */}
            <Route path="profile" element={<NotGuestRoute element={<Profile />}/>} />

            {/* Для тестов */}
            {/* <Route path="bt" element={<BackendTestBlogList />}>
              <Route path=":id" element={<BlogDetail />} /> 
            </Route> */}
            <Route path="bt_bloglist" element={<BackendTestBlogList />} />
            <Route path="bt_blogpage" element={<BlogDetail />} />

          </Route>

            {/* Служебные пути */}
          <Route path="/admin" element={<PrivateRoute element={<Admin />} roles={['admin']} />} />
          <Route path="/moderator" element={<PrivateRoute element={<Moderator />} roles={['moderator']} />} />
          <Route path="/su" element={<PrivateRoute element={<Su />} roles={['su']} />} />
        </Routes>
      </Router>
    </CssVarsProvider>
  );
}

export default App;