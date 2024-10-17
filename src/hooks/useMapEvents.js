import { useQuery } from '@tanstack/react-query';
import { getMapEvents } from '../api/eventsApi';

const useMapEvents = params => {
	return useQuery({
		queryKey: ['mapEvents'],
		queryFn: async () => {
			const response = await getMapEvents(params);
			console.log(response);
			return response.data;
		},
		staleTime: 300000,
		cacheTime: 300000,
		retry: 1,
	});
};

export default useMapEvents;
