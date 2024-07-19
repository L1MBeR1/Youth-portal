import { useQuery } from '@tanstack/react-query';
import { getModerators } from '../api/usersApi';
import { getCookie } from '../cookie/cookieUtils';

const useModerators = (page) => {
  return useQuery({
    queryKey: ['moderators', page],
    queryFn: async () => {
      const token = getCookie('token');
      const response = await getModerators(token, page);
      console.log(response)
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 3600000,
    cacheTime: 86400000,
  });
};

export default useModerators;