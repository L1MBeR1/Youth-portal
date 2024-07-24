import axios from 'axios';

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;


export const getCommentsForResource = async (token, resource_type, resource_id) => {
    try {
        const response = await axios.get(`${API_URL}/comments/${resource_type}/${resource_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }, 
            // params: {
            //     page: page,
            // },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching blogs:', error);
        throw error;
    }
};


export const postComment = async (token, resource_type, resource_id, data) => {
    try {
        const response = await axios.post(`${API_URL}/comments/${resource_type}/${resource_id}`, {
            content: data.content,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error posting comment:', error);
        throw error;
    }
};
