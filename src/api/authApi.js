import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from './axiosInstance';
import { getToken, setToken, removeToken} from '../localStorage/tokenStorage';

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;


export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
};

export const register = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, { email, password }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error('Registration failed');
    }
};


//TODO: не уверен, что он теперь нужен, если метод обновления в axiosInstance.js
export const refresh = async () => {
    try {
        const response = await axios.post(`${API_URL}/auth/refresh`, null, {
            withCredentials: true,
        });
        console.log(response)
        return response.data;
    } catch (error) {
        throw new Error('Token refresh failed');
    }
};



export const getProfile = async (token = null) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/auth/profile`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        // throw new Error('Failed to fetch profile');
        console.log('Failed to fetch profile');
    }
};


// export const getProfile = async (token) => {
//     try {
//         const response = await axios.get(`${API_URL}/auth/profile`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },

//         });
//         console.log(response)
//         return response.data;
//     } catch (error) {
//         throw new Error('Failed to fetch profile');
//     }
// };
