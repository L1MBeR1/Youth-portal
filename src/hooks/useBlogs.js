import { useQuery } from '@tanstack/react-query';
import { getBlogsByPage } from '../api/blogsApi';
import { getCookie } from '../cookie/cookieUtils';

const useBlogs = (page, setLastPage,searchValue,crtFrom,crtTo) => {
  return useQuery({
    queryKey: ['admin/blogs'],
    queryFn: async () => {
      const token = getCookie('token');
      // console.log(page,token)
      const response = await getBlogsByPage(token, page,'title',searchValue,crtFrom,crtTo);
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

export default useBlogs;