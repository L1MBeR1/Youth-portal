import axios from 'axios';

const API_URL = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_SERVER_IP}/api`;

export const getOrganizationsByPage = async params => {
	try {
		const response = await axios.get(`${API_URL}/organizations`, {
			params: params,
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching оrganizations:', error);
		throw error;
	}
};

export const getOrganization = async id => {
	console.log(id);
	try {
		const response = await axios.get(`${API_URL}/organizations/${id}`, {});
		console.log(response);
		return response.data;
	} catch (error) {
		console.error('Error fetching organization:', error);
		throw error;
	}
};
