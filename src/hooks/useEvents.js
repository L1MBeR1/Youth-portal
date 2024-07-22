import { useQuery } from '@tanstack/react-query';
import { getEventsByPage } from '../api/eventsApi';
import { getCookie } from '../cookie/cookieUtils';

const useEvents = (page, setLastPage) => {
  return useQuery({
    queryKey: ['admin/events'],
    queryFn: async () => {
      const token = getCookie('token');
      const response = await getEventsByPage(token, page);
      setLastPage(response.message.last_page)
      console.log(response)
      return response.data;
    },
    meta: {
      tags: ['admin']
    },
    keepPreviousData: true,
    staleTime: 300000,
    cacheTime: 600000,
  });
};

export default useEvents;