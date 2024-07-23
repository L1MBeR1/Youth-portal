import { useQuery } from '@tanstack/react-query';
import { getModerators } from '../api/usersApi';
import { getCookie } from '../cookie/cookieUtils';

const useModerators = (queryKey,tags,page, setLastPage,searchFields,searchValues,) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const token = getCookie('token');
      const response = await getModerators(token, page,searchFields,searchValues);
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

export default useModerators;