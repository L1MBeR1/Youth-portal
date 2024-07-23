import axios from "axios";

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

export const getEventsByPage = async (token, page) => {
  try {
    const response = await axios.get(`${API_URL}/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        withAuthors: true,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};