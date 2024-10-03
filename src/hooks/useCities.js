import { useQuery } from '@tanstack/react-query';
import { getCities } from '../api/eventsApi';

const useCities = () => {
	return useQuery({
		queryKey: ['cities'],
		queryFn: async () => {
			const response = await getCities(null);
			console.log(response);
			return response.data;
		},
		staleTime: 300000,
		cacheTime: 300000,
		retry: 1,
	});
};

export default useCities;
