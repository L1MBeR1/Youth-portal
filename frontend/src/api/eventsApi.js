import axios from "axios";

const API_URL = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_SERVER_IP}/api`;

export const getEventsByPage = async (token,params) => {
  try {
    const response = await axios.get(`${API_URL}/events`, {
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
