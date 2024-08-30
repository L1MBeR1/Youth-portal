import axios from "axios";

const API_URL = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_SERVER_IP}/api`;

export const getUsers = async (token, params) => {
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

export const getUser = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`, {
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
};
export const deleteUser = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },

    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
};

export const updateUser = async (id, token, data) => {
  console.log(`%cCALL: updateUser`, 'background: #000; color: #ff0');
  console.log(id, token, data);

  try {
      const response = await axios.put(
          `${API_URL}/users/${id}`,
          data,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );
      return response.data;
  } catch (error) {
      throw new Error('Failed to update user');
  }
};
export const updateUserEmail = async (id, token, email) => {
  console.log(`%cCALL: updateUser`, 'background: #000; color: #ff0');
  console.log(id, token, email);

  try {
      const response = await axios.put(
          `${API_URL}/users/${id}/email`,
          email,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );
      return response.data;
  } catch (error) {
      throw new Error('Failed to update email');
  }
};

export const updateUserPassword = async (id, token, password) => {
  console.log(`%cCALL: updateUser`, 'background: #000; color: #ff0');
  console.log(id, token, password);

  try {
      const response = await axios.put(
          `${API_URL}/users/${id}/password`,
          password,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );
      return response.data;
  } catch (error) {
      throw new Error('Failed to update password');
  }
};

export const deleteModerator = async (token, id) => {
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
  console.log(token, email)
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
export const deleteBlogger = async (token, id) => {
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

