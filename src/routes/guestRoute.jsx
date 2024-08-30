import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/authUtils/tokenStorage';

const GuestRoute = ({ element }) => {
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchToken = async () => {
			const { token } = await getToken('GuestRoute');
			setToken(token);
			setLoading(false);
		};

		fetchToken();
	}, []);

	if (loading) {
		return <></>;
	}

	if (!token) {
		return element;
	}

	return <Navigate to='/404' />;
};

export default GuestRoute;
