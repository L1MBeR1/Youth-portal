import axios from 'axios';

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

export const getBlogsByPage = async (token, page, searchFields, searchValues) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        withAuthors: true,
        page: page,
        searchFields: searchFields,
        searchValues: searchValues,
      },
    });
    console.log(response)
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


// Актуальный
// TODO: Rename
export const getBlogsActual = async (token, params) => {
  try {
    const response = await axios.get(`${API_URL}/blogs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};


