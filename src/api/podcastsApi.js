import axios from 'axios';

const API_URL = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_SERVER_IP}/api`;

export const getPodcastsByPage = async (token, params) => {
	try {
		const response = await axios.get(`${API_URL}/podcasts`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params: params,
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching podcasts:', error);
		throw error;
	}
};
export const getMyPodcasts = async (token, params) => {
	try {
		const response = await axios.get(`${API_URL}/podcasts/my`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params: params,
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching podcasts:', error);
		throw error;
	}
};
export const getPodcast = async (token, id) => {
	console.log(id);
	try {
		const response = await axios.get(`${API_URL}/podcasts/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching podcast:', error);
		throw error;
	}
};

export const changePodcastStatus = async (token, id, status) => {
	try {
		const response = await axios.put(
			`${API_URL}/podcasts/${id}/status`,
			{ status: status },
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
export const getPublishedPodcasts = async params => {
	try {
		const response = await axios.get(`${API_URL}/podcasts/published`, {
			params: params,
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching podcasts:', error);
		throw error;
	}
};
export const getUserPublishedPodcasts = async userId => {
	try {
		const response = await axios.get(`${API_URL}/podcasts/published/`, {
			params: { authorId: userId },
		});
		// console.log(response)
		return response.data;
	} catch (error) {
		console.error('Error fetching podcasts:', error);
		throw error;
	}
};

export const postPodcast = async (token, params) => {
	console.log(token, params);
	try {
		const response = await axios.post(`${API_URL}/podcasts`, params, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error createPodcast', error);
		throw error;
	}
};

export const updatePodcast = async (token, params, id) => {
	try {
		const response = await axios.put(`${API_URL}/podcasts/${id}`, params, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error update podcast', error);
		throw error;
	}
};
