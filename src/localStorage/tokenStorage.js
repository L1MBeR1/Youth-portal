import { refresh } from '../api/authApi.js';

export const setToken = (token, hours = 1) => {
    const now = new Date();
    const expireTime = now.getTime() + hours * 1 * 20 * 1000;
    const tokenData = {
        value: token,
        expire: expireTime
    };
    localStorage.setItem('accessToken', JSON.stringify(tokenData));
};

export const getToken = () => {
    const tokenData = JSON.parse(localStorage.getItem('accessToken'));
    const now = new Date();

    if ((tokenData) && (now.getTime() < tokenData.expire)) {
        return tokenData.value;
    }
    else {
        tryRefresh();
    }
};

function tryRefresh(params) {
    const access_token = refresh();
    if (!access_token) {
        // Возможно убрать, если редирект в authApi, но там 
        // не красиво...
        console.log('Failed to refresh access token');
    }
    // установить токен в случае успеха
    console.log('tryRefresh::access_token', access_token);
}

export const removeToken = () => {
    localStorage.removeItem('accessToken');
};