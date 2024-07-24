import axios from 'axios';

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};

export const register = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { email, password });
      return response.data;
    } catch (error) {
      throw new Error('Registration failed');
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
