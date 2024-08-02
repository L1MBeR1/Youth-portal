import { useQuery } from '@tanstack/react-query';
import {jwtDecode} from 'jwt-decode';
import { getToken } from '../utils/authUtils/tokenStorage.js'; 
import { getProfile } from '../api/authApi.js';

const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {

      const {token}= await getToken('useProfile');
      if (!token) {
        return null;
      }
      const decoded = jwtDecode(token);
      if (decoded) {
        const profileData = await getProfile(token);
        const roles = decoded.roles;
        return { ...profileData.data, roles };
      }
      return null;
    },
    staleTime: 300000, 
    cacheTime: 86400000,
    retry:1
  });
};

export default useProfile;
