import { useQuery } from '@tanstack/react-query';
import { getToken } from '../utils/authUtils/tokenStorage';

const usePublicationsById = (queryKey,api,id,setLastPage) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const {token}= await getToken('usePublications');
      
      if (!token) {
        return null;
      }
      const response = await api(token, id);
      console.log(1)
      console.log(response)
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 300000,
    cacheTime: 300000,
    retry:1
  });
};

export default usePublicationsById;