import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { removeToken } from '../../../utils/authUtils/tokenStorage.js';
import { useQueryClient } from '@tanstack/react-query';
import useProfile from '../../../hooks/useProfile.js';
import { logout } from '../../../api/authApi.js';

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
import SettingsIcon from '@mui/icons-material/Settings';

import profileBlank from '../../../img/profile-blank.png'
import { getToken } from '../../../utils/authUtils/tokenStorage.js';

function HeaderProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: profileData, isLoading } = useProfile();

  const handleLogout = async () => {

    // 1. get access token
    // 2. logout
    // 3. remove token from storage
    const accessToken = await getToken();
    await logout(accessToken.token);
    removeToken();


    navigate('/login');
    queryClient.removeQueries(['profile']);
  };
  const profileMenu = () => {
    return (
      <Dropdown>
        <MenuButton
          slots={{ root: Avatar }}
          slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
        >
          <Avatar size="sm" src={profileData.profile_image_uri || profileBlank} />
        </MenuButton>
        <Menu size="sm" placement="bottom-end">
          <MenuItem component={Link} to="/profile">
            <PersonIcon />
            Профиль
          </MenuItem>
          {profileData.roles.includes('admin') && (
            <MenuItem component={Link} to="/admin">
              Панель админа
            </MenuItem>
          )}
          {profileData.roles.includes('superuser') && (
            <MenuItem component={Link} to="/superuser">
              Панель суперюзера
            </MenuItem>
          )}
          {profileData.roles.includes('moderator') && (
            <MenuItem component={Link} to="/moderator">
              Панель модератора
            </MenuItem>
          )}
          <MenuItem>
            <SettingsIcon />
            Настройки
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
    )
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        height: '100%',
        minWidth: '39px',
        justifyContent: 'center',
        alignContent: 'center'
      }}
    >
      {/* <CircularProgress color="neutral"size="sm" variant="solid" /> */}
      {isLoading ? (
        <CircularProgress color="neutral" size="sm" variant="solid"
          sx={{ '--CircularProgress-size': '30px' }}
        />
      ) : profileData ? (
        <>
          {profileMenu()}
        </>

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