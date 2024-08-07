import axios from 'axios';

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

export const getBlogsByPage = async (token, params) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params
    });
    // console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};
export const changeBlogStatus = async (token, id, status) => {
  try {
    const response = await axios.put(`${API_URL}/blogs/${id}/status`, { status: status, },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const getPublishedBlogs = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/published`, {
      params: params
    });
    // console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};
export const getBlog = async (token,id) => {
  console.log(id)
  try {
    const response = await axios.get(`${API_URL}/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const getUserPublishedBlogs = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/published/`, {
      userId
    });
    // console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const likeTheBlog = async (token,id) => {
  try {
    // console(token,id)
    const response = await axios.post(`${API_URL}/blogs/${id}/like`,   {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error liking blog:', error);
    throw error;
  }
};

