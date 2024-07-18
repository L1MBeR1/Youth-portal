import axios from "axios";

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

export const getModerators= async (token,page) => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          role_name:'moderator',
          page: page,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch profile');
    }
  };