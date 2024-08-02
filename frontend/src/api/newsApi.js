import axios from "axios";

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

export const getNewsByPage = async (token, params) => {
  try {
    const response = await axios.get(`${API_URL}/news`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

export const changeNewStatus = async (token, id, status) => {
  try {
    const response = await axios.put(`${API_URL}/news/${id}/status`, { status: status, },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error changing status:', error);
    throw error;
  }
};

export const getPublishedNews = async (token, params) => {
  console.log(token,params)
  try {
    const response = await axios.get(`${API_URL}/news/published`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params
    });
    // console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};
export const getNew = async (id) => {
  console.log(id)
  try {
    const response = await axios.get(`${API_URL}/news/${id}`, {
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching new:', error);
    throw error;
  }
};
