import { useQuery } from '@tanstack/react-query';
import { getProject } from '../api/projectsApi';
import { getToken } from '../utils/authUtils/tokenStorage';

const useProjectById = id => {
	return useQuery({
		queryKey: ['project', id],
		queryFn: async () => {
			const { token } = await getToken('useProfile');
			const response = await getProject(token, id);
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

export default useProjectById;
