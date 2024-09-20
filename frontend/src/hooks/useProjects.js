import { useQuery } from '@tanstack/react-query';
import { getProjectsByPage } from '.././api/projectsApi';
const useProjects = (setLastPage, params) => {
	return useQuery({
		queryKey: ['projects'],
		queryFn: async () => {
			const response = await getProjectsByPage(null, params);
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

export default useProjects;
