import axios from 'axios';

const API_URL = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_SERVER_IP}/api`;

export const getProjectsByPage = async params => {
	try {
		const response = await axios.get(`${API_URL}/projects`, {
			params,
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching projects:', error);
		throw error;
	}
};

export const getProject = async (token, id) => {
	console.log(id);
	try {
		const response = await axios.get(`${API_URL}/projects/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		console.log(response);
		return response.data;
	} catch (error) {
		console.error('Error fetching project:', error);
		throw error;
	}
};
