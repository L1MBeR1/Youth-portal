import { useQuery } from '@tanstack/react-query';
import { getEventsByPage } from '../../api/eventsApi';
import { getToken } from '../../utils/authUtils/tokenStorage';

const useEvents = (queryKey,tags,setLastPage, params) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const {token}= await getToken('useEvents');
      if (!token) {
        return null;
      }
      const response = await getEventsByPage(token, params);
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