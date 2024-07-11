import axios from 'axios';

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

export const getBlogs = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/blogs/index`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  };
  
//   export const getNews = async (token) => {
//     try {
//       const response = await axios.get(`${API_URL}/news`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching news:', error);
//       throw error;
//     }
//   };

//   export const getPodcasts = async (token) => {
//     try {
//       const response = await axios.get(`${API_URL}/podcasts/index`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching podcasts:', error);
//       throw error;
//     }
//   };