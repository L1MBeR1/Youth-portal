import { useQuery } from '@tanstack/react-query';
import { getProjectsByPage } from '../api/projectsApi';
import { getCookie } from '../cookie/cookieUtils';

const useProjects = (queryKey,tags,page, setLastPage) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const token = getCookie('token');
      const response = await getProjectsByPage(token, page);
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

export default useProjects;