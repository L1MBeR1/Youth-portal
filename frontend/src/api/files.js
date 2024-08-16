import axios from 'axios';

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

// TODO: !

export const getFile = async ({contentType, contentId, fileName, params = null}) => {
    try {
        const response = await fetch(`${API_URL}/files/${contentType}/${contentId}/${fileName}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error fetching the file:', error);
        throw error;
    }
};