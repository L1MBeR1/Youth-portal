import { useQuery } from '@tanstack/react-query';
import { getCommentsForResource } from '../api/commentsApi';
import { getToken } from '../utils/authUtils/tokenStorage';

const useComments= (type,id) => {
  return useQuery({
    queryKey: ['Comment'+type,id],
    queryFn: async () => {
      const {token}= await getToken('useProfile');
      const response = await getCommentsForResource(token,type,id,{page:1});
      console.log(response)
      return response.data;
    },
    
    refetchOnWindowFocus: false,
		refetchInterval: 10000,
    staleTime: 0,               
    cacheTime: 0,
		gcTime:0,    
    retry:1
  });
};

export default useComments;