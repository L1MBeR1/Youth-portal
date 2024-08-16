import { extendTheme } from '@mui/joy/styles';
import { lightPalette } from './light';
import { darkPalette } from './dark';

const theme = extendTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      smx: 750,
      md: 900,
      mdx: 1050,
      lg: 1200,
      lgx: 1350,
      xl: 1536,
      xxl: 2000,
    },
  },
  colorSchemes: {
    light: lightPalette,
    dark: darkPalette,
  },
  staticColors: {
    mainDark: "#00030F",
    mainLight: "#f5f7fa",
  },
  components:{
    JoyButton:{
      styleOverrides: {
        root: {
          borderRadius:"50px"
        },
        },
    }
  },
  typography:{
    button:{
      color:'var(--joy-palette-mainLight)'
    }
  }
});

export default theme;