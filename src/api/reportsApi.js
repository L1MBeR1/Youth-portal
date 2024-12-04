import axios from "axios";

const API_URL = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_SERVER_IP}/api`;


export const createReport = async (token, resource_type, resource_id, reason, details) => {
	try {
		const response = await axios.post(`${API_URL}/reports/`, { resource_type, resource_id, reason, details }, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Ошибка при создании жалобы:', error);
	}
};

export const getReport = async (token, params={}) => {
	try {
		const response = await axios.get(`${API_URL}/reports/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params: params,
		});
		return response.data;
	} catch (error) {
		console.error('Ошибка при получении жалобы:', error);
	}
};

export const updateReport = async (token,reason) => {
	try {
		const response = await axios.put(`${API_URL}/reports`, { reason }, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Ошибка при обновлении жалобы:', error);
	}
};

export const deleteReport = async (token) => {
	try {
		const response = await axios.delete(`${API_URL}/reports`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Ошибка при удалении жалобы:', error);
	}
};

export const blockResource = async (token, r_type, r_id) => {
	try {
		const response = await axios.post(`${API_URL}/reports/bans/${r_type}/${r_id}`, null, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		// console.error('Ошибка при блокировке ресурса:', error);
	}
};

export const excludeResource = async (token, r_type, r_id) => {
	try {
		const response = await axios.post(`${API_URL}/reports/exclusions/${r_type}/${r_id}`, null, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		// console.error(error);
	}
};