import React,{useState,useEffect,useMemo}from 'react';
import { Link,useNavigate} from 'react-router-dom';
import {getCookie, removeCookie} from '../../../cookie/cookieUtils.js';
import { getProfile } from '../../../api/auth.js';
import {jwtDecode} from 'jwt-decode';
import { useQueryClient, useQuery } from '@tanstack/react-query';


import IconButton from '@mui/joy/IconButton';
import Box from '@mui/joy/Box';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import ListDivider from '@mui/joy/ListDivider';
import Avatar from '@mui/joy/Avatar';
import CircularProgress from '@mui/joy/CircularProgress';

import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

import profileBlank from '../../../img/profile-blank.png'

  
function HeaderProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  console.log(1)
  const { data: profileData, isFetching } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const token = getCookie('token');
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded) {
          const profileData = await getProfile(token);
          console.log(profileData)
          return profileData.data;
        }
      }
      return null;
    },
    initialData: () => {
      const cachedProfileData = queryClient.getQueryData('profile');
      if (cachedProfileData) {
        return cachedProfileData;
      } else {
        return undefined;
      }
    },
    staleTime: 3600000, 
    cacheTime: 86400000,
    keepPreviousData: true
  });

const handleLogout = () => {
    removeCookie('token');
    navigate('/login');
    queryClient.removeQueries(['profile']);
  };

  return (
    <Box
    sx={{
      display:'flex',
      flexGrow:1,
      height:'100%',
      minWidth:'39px',
      justifyContent:'center',
      alignContent:'center'
    }}
    >
      {/* <CircularProgress color="neutral"size="sm" variant="solid" /> */}
      {isFetching ? (
        <CircularProgress color="neutral"size="sm" variant="solid" 
        sx={{ '--CircularProgress-size': '30px' }}
        />
      ) : profileData ? (
        <Dropdown>
          <MenuButton
            slots={{ root: Avatar }}
            slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
          >
            <Avatar size="sm" src={profileData.profile_image_uri || profileBlank} />
          </MenuButton>
          <Menu size="sm" placement="bottom-end">
            <MenuItem>
              <PersonIcon />
              Профиль
            </MenuItem>
            <ListDivider />
            <MenuItem
              onClick={handleLogout}
              variant="soft"
              color="danger"
            >
              <LogoutIcon />
              Выйти
            </MenuItem>
          </Menu>
        </Dropdown>
      ) : (
        <Link to="/login">
          <IconButton variant='outlined'>
            <PermIdentityIcon />
          </IconButton>
        </Link>
      )}
    </Box>
  );
}
export default HeaderProfile;