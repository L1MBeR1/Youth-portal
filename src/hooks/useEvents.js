import { useQuery } from '@tanstack/react-query';
import { getEventsByPage } from '../api/eventsApi';
import { getToken } from '../localStorage/tokenStorage';

const useEvents = (queryKey,tags,page, setLastPage) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const token = getToken();
      const response = await getEventsByPage(token, page);
      setLastPage(response.message.last_page)
      console.log(response)
      return response.data;
    },
    meta: {
      tags: tags
    },
    keepPreviousData: true,
    staleTime: 300000,
    cacheTime: 600000,
  });
};

export default useEvents;