import axios from 'axios';

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;


export const getAudio = async (params = null) => {
    try {
        const response = await axios.get(`${API_URL}/proxy/audio`, {
            responseType: 'blob',  // Указываем, что ожидаем ответ типа Blob
            params: params
        });

        // Создаем URL для полученного Blob
        const audioUrl = URL.createObjectURL(response.data);
        return audioUrl;
    } catch (error) {
        console.error('Error fetching audio:', error);
        throw error;
    }
};

