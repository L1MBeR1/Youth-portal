import axios from "axios";

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

export const getUsers= async (token,params) => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch moderators');
    }
  };

  export const deleteModerator= async (token,id) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${id}/roles/${'moderator'}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete moderator');
    }
  };

  export const addModerator = async (token, email) => {
    console.log(token,email)
    try {
      const response = await axios.post(`${API_URL}/users/roles`,
        {
          email: email,
          roles: ["moderator"],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to add moderator');
    }
  };

  //Блогеры
  export const deleteBlogger= async (token,id) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${id}/roles/${'blogger'}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete blogger');
    }
  };

  export const addBlogger = async (token, email) => {
    try {
      const response = await axios.post(`${API_URL}/users/roles`,
        {
          email: email,
          roles: ["blogger"],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to add blogger');
    }
  };

