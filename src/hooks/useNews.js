import { useQuery } from '@tanstack/react-query';
import { getNewsByPage } from '../api/newsApi';
import { getToken } from '../utils/authUtils/tokenStorage';

const useNews = (queryKey,tags,setLastPage, params) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const {token}= await getToken('useToken');
      if (!token) {
        return null;
      }
      const response = await getNewsByPage(token, params);
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

export default useNews;