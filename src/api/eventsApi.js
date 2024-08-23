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
    console.error("Error fetching events:", error);
    throw error;
  }
};
export const getHomeEvents = async (token,params) => {
  try {
    const response = await axios.get(`${API_URL}/events/userEvents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
export const getEvent = async (token,id) => {
  console.log(id)
  try {
    const response = await axios.get(`${API_URL}/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const getCountries = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/countries/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response)
    return response;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

export const getCities = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/cities/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response)
    return response;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};
