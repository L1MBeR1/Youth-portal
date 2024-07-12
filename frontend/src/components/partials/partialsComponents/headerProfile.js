import React,{useState,useEffect}from 'react';
import { Link,useNavigate} from 'react-router-dom';
import {getCookie, removeCookie} from '../../../cookie/cookieUtils.js';
// import { getToken,removeToken } from '../../localStorage/tokenStorage.js'
import {jwtDecode} from 'jwt-decode';

import { useColorScheme } from '@mui/joy/styles';

import Tooltip from '@mui/joy/Tooltip';
import IconButton from '@mui/joy/IconButton';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import ListDivider from '@mui/joy/ListDivider';
import Sheet from '@mui/joy/Sheet';

import PermIdentityIcon from '@mui/icons-material/PermIdentity';

  
function HeaderProfile() {
const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    const token = getCookie('token');
    // console.log(token)
    if (token) {
        const decoded = jwtDecode(token);
      if (decoded) {
        setIsAuth(true);
      }
      else{
        setIsAuth(false)
      }
    }
    else{
      setIsAuth(false)
    }
}, []);
const handleLogout = () => {
    removeCookie('token');
    setIsAuth(false); 
    navigate('/')
  };
  return (
    <Box>
        {isAuth ?(
          <Dropdown>
          <MenuButton
          slots={{ root: IconButton }}
          slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
          >
              <PermIdentityIcon />
          </MenuButton>
          <Menu
          placement="bottom-end"
          >
            <MenuItem>Профиль</MenuItem>
            <ListDivider />
            <MenuItem onClick={handleLogout}>Выйти</MenuItem>
          </Menu>
        </Dropdown>
        ):(
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