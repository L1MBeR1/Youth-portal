import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/usersApi';
import { getToken } from '../localStorage/tokenStorage';

const useModerators = (queryKey,tags,setLastPage, params) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const token = getToken();
      const response = await getUsers(token, params);
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