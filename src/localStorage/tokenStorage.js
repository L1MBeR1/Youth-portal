import {refresh} from '../api/authApi.js';

export const setToken = (token, hours=1) => {
    const now = new Date();
    const expiryTime = now.getTime() + hours  *60*60* 1000;
    const tokenData = {
      value: token,
      expiry: expiryTime
    };
    localStorage.setItem('accessToken', JSON.stringify(tokenData));
  };
  
  export const getToken = () => {
    const tokenData = JSON.parse(localStorage.getItem('accessToken'));
    const now = new Date();
    if ((tokenData)&&(now.getTime() < tokenData.expiry)) {
      return tokenData.value;
    }
    else{
      // refresh();
      return null;
    }
  };
  
  export const removeToken = () => {
    localStorage.removeItem('accessToken');
  };