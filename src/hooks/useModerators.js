import { useQuery } from '@tanstack/react-query';
import { getModerators } from '../api/usersApi';
import { getCookie } from '../cookie/cookieUtils';

const useModerators = (page, setLastPage,searchValue,bdFrom,bdTo) => {
  return useQuery({
    queryKey: ['admin/moderators'],
    queryFn: async () => {
      const token = getCookie('token');
      const response = await getModerators(token, page,'email',searchValue,bdFrom,bdTo);
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

export default useModerators;