import { useQuery } from '@tanstack/react-query';
import { getToken } from '../utils/authUtils/tokenStorage';

const usePublicationsById = (type,api,id) => {
  return useQuery({
    queryKey: [type,id],
    queryFn: async () => {
      const {token}= await getToken('useProfile');
      const response = await api(token,id);
      console.log(response)
      return response.data;
    },
    
    enabled: !!id,
    staleTime: 180000,
    cacheTime: 180000,
    gcTime:60000,
    retry:1
  });
};

export default usePublicationsById;