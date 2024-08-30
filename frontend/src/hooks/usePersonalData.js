import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { getProfile } from '../api/authApi.js';
import { getUser } from '../api/usersApi.js';
import { getToken } from '../utils/authUtils/tokenStorage.js';

const usePersonalData = () => {
  return useQuery({
    queryKey: ['personalData'],
    queryFn: async () => {

      const {token}= await getToken('useProfile');
      if (!token) {
        return null;
      }
      const decoded = jwtDecode(token);
      if (decoded) {
        const profileData = await getProfile(token);
				console.log(profileData)
				const result = await getUser(profileData.data.user_id);
				console.log(result)
				return result.data;
      }
      return null;
    },
    staleTime: 300000, 
    cacheTime: 86400000,
    retry:1
  });
};

export default usePersonalData;
