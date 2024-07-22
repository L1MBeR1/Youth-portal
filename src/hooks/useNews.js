import { useQuery } from '@tanstack/react-query';
import { getNewsByPage } from '../api/newsApi';
import { getCookie } from '../cookie/cookieUtils';

const useNews = (page, setLastPage,searchValue,crtFrom,crtTo) => {
  return useQuery({
    queryKey: ['admin/news'],
    queryFn: async () => {
      const token = getCookie('token');
      const response = await getNewsByPage(token, page,'title',searchValue,crtFrom,crtTo);
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

export default useNews;