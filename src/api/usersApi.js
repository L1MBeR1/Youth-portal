import axios from "axios";

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

export const getModerators= async (token,page,searchColumnName,searchValue,bdFrom,bdTo) => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          role_name:'moderator',
          page: page,
          searchColumnName:searchColumnName,
          searchValue:searchValue,
          bdFrom:bdFrom,
          bdTo:bdTo,
        },
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
