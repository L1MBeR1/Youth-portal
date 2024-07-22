import { useQuery } from '@tanstack/react-query';
import { getCookie } from '../cookie/cookieUtils.js';
import { getProfile } from '../api/authApi.js';
import {jwtDecode} from 'jwt-decode';

const useProfile = () => {
  
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const token = getCookie('token');
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded) {
          const profileData = await getProfile(token);
          const roles = decoded.roles;
          // setRoles(roles);
          console.log(profileData);
          return { ...profileData.data, roles };
        }
      }
      return null;
    },
    staleTime: 600000,
    cacheTime: 86400000,
    keepPreviousData: true,
  });
};

export default useProfile;
