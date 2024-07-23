import axios from "axios";

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

export const getNewsByPage = async (token, page,searchColumnName,searchValue,crtFrom,crtTo) => {
  try {
    const response = await axios.get(`${API_URL}/news`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        withAuthors:true,
        page: page,
        searchColumnName:searchColumnName,
        searchValue:searchValue,
        crtFrom:crtFrom,
        crtTo:crtTo
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};
