import { useQuery } from '@tanstack/react-query';
import { getHomeEvents } from '../api/eventsApi';

const useEvents = (setLastPage, params) => {
	return useQuery({
		queryKey: ['events'],
		queryFn: async () => {
			const response = await getHomeEvents(null, params);
			setLastPage(response.message.last_page);
			console.log(response);
			return response.data;
		},
		staleTime: 300000,
		cacheTime: 300000,
		retry: 1,
	});
};

export default useEvents;
