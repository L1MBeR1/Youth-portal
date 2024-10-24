import { useQuery } from '@tanstack/react-query';
import { getBlogsTags } from '../api/blogsApi';

const usePublicationsTags = () => {
	return useQuery({
		queryKey: ['tags'],
		queryFn: async () => {
			const response = await getBlogsTags();
			console.log(response);
			return response.data;
		},
		staleTime: 300000,
		cacheTime: 300000,
		retry: 1,
	});
};

export default usePublicationsTags;
