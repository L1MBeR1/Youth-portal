import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/authUtils/tokenStorage';

const PrivateRoute = ({ element, roles }) => {
	const [hasAccess, setHasAccess] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchToken = async () => {
			const { token } = await getToken();
			if (token) {
				const decoded = jwtDecode(token);
				if (roles.some(role => decoded.roles.includes(role))) {
					setHasAccess(true);
				}
			}
			setLoading(false);
		};

		fetchToken();
	}, [roles]);

	if (loading) {
		return <></>;
	}

	if (!hasAccess) {
		return <Navigate to='/404' />;
	}

	return element;
};

export default PrivateRoute;
