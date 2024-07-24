import { useQuery } from '@tanstack/react-query';
import { getCookie } from '../cookie/cookieUtils.js';
import { getProfile } from '../api/authApi.js';
import {jwtDecode} from 'jwt-decode';

const useProfile = () => {
  const token = getCookie('token');
  const queryKey = token ? ['profile'] : [];

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
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
    enabled: !!token, 
    staleTime: 600000, 
    cacheTime: 86400000, 
    keepPreviousData: true,
  });
};

export default useProfile;
