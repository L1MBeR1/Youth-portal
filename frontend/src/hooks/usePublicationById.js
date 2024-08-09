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
    
    refetchOnWindowFocus: false,
    staleTime: 180000,               
    cacheTime: 180000,
		gcTime:180000,    
    retry:1
  });
};

export default usePublicationsById;