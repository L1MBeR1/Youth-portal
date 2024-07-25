import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

export const setToken = (token) => {
    localStorage.setItem('accessToken', token);
};

export const getToken = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        const decoded = jwtDecode(token);
        const currentTime = new Date().getTime() / 1000;

        if (decoded && currentTime < decoded.exp) {
            console.log('Токен не истекает');
            return token;
        }
    } else {
        return null;
    }
};

/**
 * Получает токен из localStorage и проверяет его валидность.
 * Если токен истёк, выполняет refresh-запрос на сервер.
 * Если refresh-запрос не удался, удаляет токен из localStorage и перенаправляет на страницу логина.
 * @returns {string|null} Токен или null, если токен не был найден или истёк.
 */
export const getTokenWithRefresh = () => {
    // Получаем токен из localStorage
    const token = localStorage.getItem('accessToken');
    if (token && token !== 'undefined') {
        const decoded = jwtDecode(token);
        const currentTime = new Date().getTime() / 1000;

        // Проверяем, что токен существует и не равен строке 'undefined'
        if (decoded && currentTime < decoded.exp) {
            return token;
            // Получаем текущее время в секундах
        }
        // Если токен валиден, возвращаем его
    }

    // Используем синхронную обёртку для асинхронного вызова
    let newToken = null;
    (async () => {
        // Создаём переменную для нового токена
        try {
            const response = await axios.post(`${API_URL}/auth/refresh`, null, {
                withCredentials: true,
            });
            if (response.status === 200) {
                setToken(response.data.access_token);
                newToken = response.data.access_token;
            }
        } catch (error) {
            console.log('ERR');
            if (error.response) {
                if (error.response.status === 401) {

                    removeToken();

                    if (window.location.pathname !== '/login') {
                        // Выполняем асинхронную функцию, которая делает refresh-запрос на сервер
                        window.location.href = '/login';
                    }
                    // Если refresh-запрос удался, устанавливаем новый токен и возвращаем его
                }
            }
        }
    })();

    return newToken;
};



export const removeToken = () => {
    localStorage.removeItem('accessToken');
    // Возвращаем новый токен или null, если его не было в localStorage
};