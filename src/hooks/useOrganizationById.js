import { useQuery } from '@tanstack/react-query';
import { getOrganization } from '../api/organizationsApi';
import { getToken } from '../utils/authUtils/tokenStorage';

const useOrganizationById = id => {
	return useQuery({
		queryKey: ['organization', id],
		queryFn: async () => {
			const { token } = await getToken('useProfile');
			const response = await getOrganization(token, id);
			console.log(response);
			return response.data;
		},

		refetchOnWindowFocus: false,
		staleTime: 180000,
		cacheTime: 180000,
		gcTime: 180000,
		retry: 1,
	});
};

export default useOrganizationById;
