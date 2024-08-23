import axios from 'axios';

const API_URL = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_SERVER_IP}/api`;



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


export const uploadFile = async ({contentType, contentId, file, params = null}) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/files/${contentType}/${contentId}/`, { 
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.filename;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};