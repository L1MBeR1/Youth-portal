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

export const blockResource = async (token, resource_type, resource_id) => {
	try {

		return "ТУТ БУДЕТ БЛОКИРОВКА РЕСУРСА";

		const response = await axios.post(`${API_URL}/reports/${resource_type}/${resource_id}/block`, null, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		// console.error('Ошибка при блокировке ресурса:', error);
	}
};

export const excludeResource = (token, resource_type, resource_id) => {
	try {
		return "ТУТ БУДЕТ ИСКЛЮЧЕНИЕ ИЗ ЖАЛОБ";
	} catch (error) {
		// console.error(error);
	}
};