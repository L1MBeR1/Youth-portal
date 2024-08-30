import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { getToken } from '../utils/authUtils/tokenStorage';

const useMyPublications = (queryKey, api, setLastPage, params) => {
	console.log(params);
	return useQuery({
		queryKey: queryKey,
		queryFn: async () => {
			const { token } = await getToken();
			if (!token) {
				return null;
			}
			const decoded = jwtDecode(token);
			if (decoded) {
				const response = await api(token, params);
				setLastPage(response.message.last_page);
				console.log(response);
				return response.data;
			} else {
				return;
			}
		},
		staleTime: 300000,
		cacheTime: 300000,
		retry: 1,
	});
};

export default useMyPublications;
