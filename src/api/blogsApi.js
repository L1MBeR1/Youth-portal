import axios from 'axios';

const API_URL = `http://${process.env.REACT_APP_SERVER_IP}/api`;

  export const getBlogsByPage = async (token, page,searchColumnName,searchValue,crtFrom,crtTo) => {
    try {
      const response = await axios.get(`${API_URL}/blogs`, {
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
      console.error('Error fetching blogs:', error);
      throw error;
    }
  };
  export const changeBlogStatus= async (token, id,data,status) => {
    try {
      const response = await axios.put(`${API_URL}/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          title:'',
          description:'',
          content:'',
          cover_uri:'',
          status:status,
          views:0,
          likes:0,
          reposts:0,
        },
      });
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


