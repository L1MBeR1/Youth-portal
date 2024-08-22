import { useQuery } from '@tanstack/react-query';
import {getHomeEvents} from '../api/eventsApi'
import { getToken } from '../utils/authUtils/tokenStorage';

const useHomeEvents = () => {
  const startDate = new Date().toISOString().split('T')[0]; 
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 2); 
  const endDateString = endDate.toISOString().split('T')[0]; 
  console.log(12121)
  const perPage = 10; 

  return useQuery({
    queryKey: ['homeEvents'],
    queryFn: async () => {
      const { token } = await getToken('useEvents');

      console.log(startDate, endDateString, perPage)
      const response = await getHomeEvents(token, { start_date: startDate, end_date: endDateString, per_page: perPage });
      
      console.log(response);
      return response.data;
    },
    staleTime: 600000,               
    cacheTime: 600000,
    gcTime: 600000,
    retry:2
  });
};

export default useHomeEvents;
