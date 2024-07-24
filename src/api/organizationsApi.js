import axios from "axios";

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

export const getOrganizationsByPage = async (token, page) => {
  try {
    const response = await axios.get(`${API_URL}/organizations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching оrganizations:", error);
    throw error;
  }
};
