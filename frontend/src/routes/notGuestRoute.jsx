import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/authUtils/tokenStorage';

const NotGuestRoute = ({ element }) => {
	const [hasAccess, setHasAccess] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchToken = async () => {
			const { token } = await getToken();
			if (token) {
				const decoded = jwtDecode(token);
				if (decoded.roles) {
					setHasAccess(true);
				}
			}
			setLoading(false);
		};

		fetchToken();
	}, []);

	if (loading) {
		return <></>;
	}

	if (!hasAccess) {
		return <Navigate to='/login' />;
	}

	return element;
};

export default NotGuestRoute;
