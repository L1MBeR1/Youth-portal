import React,{useState,useEffect}from 'react';
import { Link } from 'react-router-dom';

import { useColorScheme } from '@mui/joy/styles';

import Tooltip from '@mui/joy/Tooltip';
import IconButton from '@mui/joy/IconButton';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

function ColorSchemeToggle() {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return <IconButton size="sm" variant="outlined" color="primary" />;
    }
    return (
        <Tooltip title="Change theme" variant="outlined">
        <IconButton
            id="toggle-mode"
            size="sm"
            variant="plain"
            color="neutral"
            sx={{ alignSelf: 'center',
                display:{ xs: 'none', md: 'inline-flex' }
             }}
            onClick={() => {
            if (mode === 'light') {
                setMode('dark');
            } else {
                setMode('light');
            }
            }}
        >
            {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
        </IconButton>
        </Tooltip>
    );
    }

function Header() {
const [open, setOpen] = useState(false);
  return (
    <header>
      <Box
      sx={{
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'space-between',
          outline:'1px black solid',
          background:'primary.main'
        }}
      >
          <Box sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
          <IconButton variant="outlined" color="neutral" onClick={() => setOpen(true)}>
            <MenuRoundedIcon />
          </IconButton>
          <Drawer
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            open={open}
            onClose={() => setOpen(false)}
          >
            <ModalClose />
            <DialogTitle>Logo</DialogTitle>
            <Box sx={{ px: 1 }}>
              {/* <TeamNav /> */}
            </Box>
          </Drawer>
        </Box>
        <Link to="/">
        <Box>

        
        <Typography level="h2" >
              LOGO
          </Typography>
          </Box>
          </Link>
        <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        >
          <ColorSchemeToggle
          />
          <Link to="/login">
              <Button 
              endDecorator={<KeyboardArrowRight />} 
              sx={{ borderRadius:'8px' }}
              >
              Войти
          </Button>
        </Link>
        </Stack>

      </Box>
    </header>
  );
}
{/* <header >
        <nav className='navbar-fixed'>
            <div className="nav-wrapper  grey darken-3">
                <Link to="/" className="brand-logo">Logo</Link>
                <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                <ul className="right hide-on-med-and-down">
                    <li><Link to="/login">Войти</Link></li>
                    <li><Link to="/registration">Регистрация</Link></li>
                </ul>
            </div>
        </nav>

        <ul  className="sidenav" id="mobile-demo">
            <li><Link to="/login">Войти</Link></li>
            <li><Link to="/registration">Регистрация</Link></li>

        </ul>
    </header> */}
export default Header;