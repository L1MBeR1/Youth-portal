import { useQuery } from '@tanstack/react-query';
import { getOrganizationsByPage } from '../api/organizationsApi';
const useOrganizations = (setLastPage, params) => {
	return useQuery({
		queryKey: ['organizations'],
		queryFn: async () => {
			const response = await getOrganizationsByPage(params);
			if (setLastPage) {
				setLastPage(response.message.last_page);
			}
			console.log(response);
			return response.data;
		},
		staleTime: 300000,
		cacheTime: 300000,
		retry: 1,
	});
};

export default useOrganizations;
