import { useQuery } from '@tanstack/react-query';
import { getProjectsByPage } from '../api/projectsApi';
import { getToken } from '../utils/authUtils/tokenStorage';

const useProjects = (queryKey,tags,setLastPage, params) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const {token}= await getToken('useProjects');
      if (!token) {
        return null;
      }
      const response = await getProjectsByPage(token, params);
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