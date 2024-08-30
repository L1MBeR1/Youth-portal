import { useQueries } from '@tanstack/react-query';
import { getCities, getCountries, getHomeEvents } from '../api/eventsApi';
import { getToken } from '../utils/authUtils/tokenStorage';

const useEventsWithSortData = (params) => {
  const results = useQueries({
    queries: [
      {
        queryKey: ['events'],
        queryFn: async () => {
          const { token } = await getToken('useEvents');
          const response = await getHomeEvents(token, params);
          return response.data;
        },
        staleTime: 600000,
        cacheTime: 600000,
        retry: 1,
      },
      {
        queryKey: ['cities'],
        queryFn: async () => {
          const { token } = await getToken('useCities');
          const response = await getCities(token);
          return response.data;
        },
        staleTime: 600000,
        cacheTime: 600000,
        retry: 1,
      },
      {
        queryKey: ['countries'],
        queryFn: async () => {
          const { token } = await getToken('useCountries');
          const response = await getCountries(token);
          return response.data;
        },
        staleTime: 600000,
        cacheTime: 600000,
        retry: 1,
      },
    ]
  });

  const [events, cities, countries] = results;

  return {
    events: events.data,
    cities: cities.data,
    countries: countries.data,
    refetchEvents: events.refetch,
    refetchCities: cities.refetch,
    refetchCountries: countries.refetch,
    isLoading: results.some(result => result.isLoading),
    isError: results.some(result => result.isError),
  };
};

export default useEventsWithSortData;
