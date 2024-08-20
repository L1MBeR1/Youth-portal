import axios from 'axios';

const API_URL = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_SERVER_IP}/api`;


export const getCommentsForResource = async (token,resource_type, resource_id,params) => {
    try {
        const response = await axios.get(`${API_URL}/comments/${resource_type}/${resource_id}`, {
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


export const postComment = async (token, resource_type, resource_id, content) => {
    try {
        const response = await axios.post(`${API_URL}/comments/${resource_type}/${resource_id}`, {
            content: content,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error posting comment:', error);
        throw error;
    }
};
export const postReplyComment = async (token, resource_type, resource_id, content,reply_to) => {
  try {
      const response = await axios.post(`${API_URL}/comments/${resource_type}/${resource_id}`, {
          content: content,
          reply_to
      }, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
  } catch (error) {
      console.error('Error posting comment:', error);
      throw error;
  }
};


export const likeTheComment = async (token,commentId) => {
    try {
      // console(token,id)
      const response = await axios.post(`${API_URL}/comments/${commentId}/like`,   {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response)
      return response.data;
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  };
  export const deleteLikeTheComment = async (token,commentId) => {
    try {
      // console(token,id)
      const response = await axios.delete(`${API_URL}/comments/${commentId}/like`,   {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response)
      return response.data;
    } catch (error) {
      console.error('Error deleting like:', error);
      throw error;
    }
  };