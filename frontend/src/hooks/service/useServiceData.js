import { useQuery } from '@tanstack/react-query';
import { getToken } from '../../utils/authUtils/tokenStorage';

const useServiceData = (queryKey, api, setLastPage, params) => {
	return useQuery({
		queryKey: queryKey,
		queryFn: async () => {
			const { token } = await getToken('useServiceData');
			if (!token) {
				return null;
			}
			const response = await api(token, params);
			setLastPage(response.message.last_page);
			console.log(response);
			return response.data;
		},
		meta: {
			tags: ['service'],
		},
		staleTime: 300000,
		cacheTime: 300000,
		retry: 1,
	});
};

export default useServiceData;
