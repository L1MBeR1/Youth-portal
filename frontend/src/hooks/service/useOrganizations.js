import { useQuery } from '@tanstack/react-query';
import { getOrganizationsByPage } from '../../api/organizationsApi';
import { getToken } from '../../utils/authUtils/tokenStorage';

const useOrganizations = (queryKey,tags,setLastPage, params) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const {token}= await getToken('useOrg');
      if (!token) {
        return null;
      }
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