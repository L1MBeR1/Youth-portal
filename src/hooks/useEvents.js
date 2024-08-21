import { useQuery } from '@tanstack/react-query';
import { getEventsByPage } from '../api/eventsApi';
import { getToken } from '../utils/authUtils/tokenStorage';

const useEvents = (setLastPage, params) => {
  return useQuery({
    queryKey: ['events'],
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
		staleTime: 180000,               
    cacheTime: 180000,
		gcTime:180000,    
  });
};

export default useEvents;