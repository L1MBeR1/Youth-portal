import { useQuery } from '@tanstack/react-query';
import { getPodcast } from '../api/podcastsApi';
import { getToken } from '../utils/authUtils/tokenStorage';

const usePodcastById = id => {
	return useQuery({
		queryKey: ['podcast', id],
		queryFn: async () => {
			const { token } = await getToken('useProfile');
			const response = await getPodcast(token, id);
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

export default usePodcastById;
