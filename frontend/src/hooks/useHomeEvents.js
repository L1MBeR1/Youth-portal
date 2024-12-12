import { useQuery } from '@tanstack/react-query';
import { getHomeEvents } from '../api/eventsApi';

const useHomeEvents = () => {
	const startDate = new Date().toISOString().split('T')[0];
	const endDate = new Date();
	endDate.setMonth(endDate.getMonth() + 3);
	const endDateString = endDate.toISOString().split('T')[0];
	const perPage = 10;

	return useQuery({
		queryKey: ['homeEvents'],
		queryFn: async () => {
			console.log(startDate, endDateString, perPage);
			const response = await getHomeEvents({
				endFrom: startDate,
				endTo: endDateString,
				per_page: perPage,
			});

			console.log(response);
			return response.data;
		},
		staleTime: 600000,
		cacheTime: 600000,
		gcTime: 600000,
		retry: 2,
	});
};

export default useHomeEvents;
