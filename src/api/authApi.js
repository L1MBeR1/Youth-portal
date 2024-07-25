import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
			console.log(response);
			return response.data.access_token;
		} else {
			// Обработка непредвиденных статусов ответа
			console.error('Unexpected response status:', response.status);
			throw new Error('Token refresh failed: Unexpected response');
		}
	} catch (error) {
		// Проверка наличия ответа и его данных
		if (error.response) {
			console.error('Error response data:', error.response.data);
			console.error('Error response status:', error.response.status);

			// Сообщение об отсутствии токена обновления в куки
			if (error.response.status === 401 && error.response.data.error === 'Refresh token is missing') {
				// Выполнить редирект
				// TODO: !
			}
		} else if (error.request) {
			// Ошибка запроса
			console.error('Error request:', error.request);
		} else {
			// Другие ошибки
			console.error('Error message:', error.message);
		}
		throw new Error('Token refresh failed');
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
