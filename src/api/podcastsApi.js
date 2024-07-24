import axios from 'axios';

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

export const getPodcastsByPage = async (token, page,searchColumnName,searchValue,crtFrom,crtTo) => {
    try {
      const response = await axios.get(`${API_URL}/podcasts`, {
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
      console.error('Error fetching podcasts:', error);
      throw error;
    }
  };
  export const changePodcastStatus = async (token, id, status) => {
    try {
      const response = await axios.put(`${API_URL}/podcasts/${id}/status`, { status: status, },
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