import { useQuery } from '@tanstack/react-query';
import { getToken } from '../utils/authUtils/tokenStorage';

const useBlogs = (queryKey,api,setLastPage,params) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const {token}= await getToken('usePublications');
      if (!token) {
        return null;
      }
      const response = await api(token, params);
      setLastPage(response.message.last_page)
      console.log(response)
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 300000,
    cacheTime: 300000,
    retry:1
  });
};

export default useBlogs;