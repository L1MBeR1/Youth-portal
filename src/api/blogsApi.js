import axios from 'axios';

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

export const getBlogs = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/blogs/index`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  };

  export const getBlogsByPage = async (token, page) => {
    try {
      const response = await axios.get(`${API_URL}/blogs/index`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  };