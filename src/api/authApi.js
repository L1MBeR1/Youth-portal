import axios from 'axios';
import { setToken, removeToken } from '../localStorage/tokenStorage';

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

export const refresh = async () => {
	try {
		const response = await axios.post(`${API_URL}/auth/refresh`, null, {
			withCredentials: true,
		});
		if (response.status === 200) {
			setToken(response.data.access_token);
			console.log('Успешное обновление токена');
		}
	} catch (error) {
		if (error.response) {
			if (error.response.status === 401) {
				console.log('Some problems: ', error.response.data.error);
				console.log('Detailed: ', error.response);

				removeToken();

				window.location.href = '/login'
			}
		}
	}
};

export const getProfile = async (token) => {
	try {
		const response = await axios.get(`${API_URL}/auth/profile`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},

		});
		console.log(response)
		return response.data;
	} catch (error) {
		throw new Error('Failed to fetch profile');
	}
};
