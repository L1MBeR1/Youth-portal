import { jwtDecode } from 'jwt-decode';
import { refresh } from '../../api/authApi.js';

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('accessToken', token);
  }
};

let refreshPromise = null;

const refreshToken = async () => {
  if (!refreshPromise) {
    let token = null
    refreshPromise = refresh()
      .then(response => {
        if (response && response.access_token) {
          token = response.access_token;
          localStorage.setItem('accessToken', token);
          return token;
        } else {
          token = null;
          localStorage.removeItem('accessToken');
          throw new Error('Failed to refresh token');
        }
      })
      .catch(error => {
        token = null;
        localStorage.removeItem('accessToken');
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

export const getToken = async (check = 'default') => {
  console.log(check);
  const now = new Date();
  const currentToken = localStorage.getItem('accessToken');
  console.log(currentToken);

  if (currentToken) {
    const decoded = jwtDecode(currentToken);
    const currentTime = now.getTime() / 1000;
    if (decoded && currentTime < decoded.exp) {
      console.log('no refresh');
      return { token: currentToken, needsRedirect: false };
    }
  }

  try {
    console.log('refresh');
    const newToken = await refreshToken();
    return { token: newToken, needsRedirect: false };
  } catch (error) {
    return { token: null, needsRedirect: true };
  }
};

export const removeToken = () => {
  localStorage.removeItem('accessToken');
};
