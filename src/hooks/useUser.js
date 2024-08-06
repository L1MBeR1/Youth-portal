import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/usersApi';

const useUser = (id) => {
  return useQuery({
    queryKey: ['user',id],
    queryFn: async () => {
			const response = await getUser(id);
      console.log(response)
      return response.data;
    },
    staleTime: 300000, 
    cacheTime: 300000,
    retry:1
  });
};

export default useUser;
