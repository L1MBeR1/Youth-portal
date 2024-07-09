import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const CheckRoute = ({ element: Element, roles, ...rest }) => {
  const token = Cookies.get('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const userRoles = decodedToken.roles;

    const hasRequiredRole = roles.some(role => userRoles.includes(role));
    if (!hasRequiredRole) {
      return <Navigate to="/not-found" />;
    }

    return <Element />;
  } catch (error) {
    console.error('Token decoding failed:', error);
    return <Navigate to="/login" />;
  }
};

const PrivateRoute = ({ element, ...rest }) => (
  <Route {...rest} element={<CheckRoute element={element} {...rest} />} />
);

export default PrivateRoute;