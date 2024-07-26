import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { getToken, setToken, removeToken } from '../localStorage/tokenStorage';

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true
});


//BUG: Есть ошибка - 
// Если заменить символы в access_token в LocalStorage,
// то иногда от сервера приходят ошибки 5-- вместо 4--.
// Это будет исправлено позже. Нужно искать почему токен вообще был допущен.


//TODO: По примеру API/auth.js::getProfile() нужно заменить 
// const response = await axios.глагол();
//              на
// const response = await axiosInstance.глагол();


const refreshAccessToken = async () => {
    try {
        const response = await axios.post(`${API_URL}/auth/refresh`, null, {
            withCredentials: true,
        });
        const newAccessToken = response.data.access_token;
        if (newAccessToken) {
            setToken(newAccessToken);
        } else {
            throw new Error('No access token received');
        }
        return newAccessToken;
    } catch (error) {
        console.error('Unable to refresh token', error);
        throw error;
    }
};

axiosInstance.interceptors.request.use(
    async (config) => {
        let accessToken = getToken();

        if (!accessToken) {
            try {
                accessToken = await refreshAccessToken();
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            } catch (error) {
                removeToken();

                //TODO: Сделать попап (или другое уведомление) вместо редиректов. 
                // Нужно сделать проверку isAuthorized, чтобы не уведомлять всех
                // window.location.href = '/login';
                throw error;
            }
        } else {
            const decodedToken = jwtDecode(accessToken);
            const currentTime = new Date().getTime() / 1000;

            if (decodedToken.exp < currentTime) {
                try {
                    const newAccessToken = await refreshAccessToken();
                    config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                } catch (error) {
                    removeToken();

                    //TODO: Сделать попап (или другое уведомление) вместо редиректов. 
                    // Нужно сделать проверку isAuthorized, чтобы не уведомлять всех
                    // window.location.href = '/login';
                    throw error;
                }
            } else {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshAccessToken();
                axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (error) {
                removeToken();

                //TODO: Сделать попап (или другое уведомление) вместо редиректов. 
                // Нужно сделать проверку isAuthorized, чтобы не уведомлять всех
                // window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
