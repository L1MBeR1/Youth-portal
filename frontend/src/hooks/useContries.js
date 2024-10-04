import { useQuery } from '@tanstack/react-query';
import { getCountries } from '../api/eventsApi';

const useCountries = () => {
	return useQuery({
		queryKey: ['countries'],
		queryFn: async () => {
			const response = await getCountries(null);
			console.log(response);
			return response.data;
		},
		staleTime: 300000,
		cacheTime: 300000,
		retry: 1,
	});
};

export default useCountries;
