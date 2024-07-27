import { useQuery } from '@tanstack/react-query';
import { getBlogsByPage } from '../api/blogsApi';
import { getToken } from '../localStorage/tokenStorage';

const useBlogs = (queryKey,tags,setLastPage,params) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const token = getToken();
      const response = await getBlogsByPage(token, params);
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

export default useBlogs;