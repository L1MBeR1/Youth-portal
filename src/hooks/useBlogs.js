import { useQuery } from '@tanstack/react-query';
import { getBlogsByPage } from '../api/blogsApi';
import { getCookie } from '../cookie/cookieUtils';

const useBlogs = (queryKey,tags,page, setLastPage,searchFields,searchValues,) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const token = getCookie('token');
      console.log(searchFields,searchValues)
      const response = await getBlogsByPage(token, page,searchFields,searchValues);
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