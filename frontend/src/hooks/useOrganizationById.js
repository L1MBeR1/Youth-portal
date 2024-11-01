import { useQuery } from '@tanstack/react-query';
import { getOrganization } from '../api/organizationsApi';

const useOrganizationById = id => {
	return useQuery({
		queryKey: ['organization', id],
		queryFn: async () => {
			const response = await getOrganization(id);
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
