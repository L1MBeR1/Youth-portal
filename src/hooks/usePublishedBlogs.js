import { useQuery } from '@tanstack/react-query';
import { getToken } from '../utils/authUtils/tokenStorage.js'; 

const usePublishedBlogs = (queryKey,api,setLastPage,params) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const response = await api(params);
      setLastPage(response.message.last_page)
      console.log(response)
      return response.data;
    },
    staleTime: 300000,
    cacheTime: 300000,
    retry:1
  });
};

export default usePublishedBlogs;