import { useQuery } from '@tanstack/react-query';
import { getOrganizationsByPage } from '../api/organizationsApi';
import { getToken } from '../localStorage/tokenStorage';

const useOrganizations = (queryKey,tags,setLastPage, params) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const token = getToken();
      const response = await getOrganizationsByPage(token, params);
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

export default useOrganizations;