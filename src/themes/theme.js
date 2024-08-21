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
    mainDark: "#121212",
    mainLight: "#f9f4e9",
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
  focus:{
    default:{
      outline:"var(--joy-palette-main-primary)"
    }
  },
  typography:{
    h1:{
      fontWeight:"600",
      fontSize:"clamp(2.5rem,4vw, 5.5rem)",
      lineHeight:'1.2'
    },
    h2:{
      fontWeight:"600",
      fontSize:"clamp(2rem,3vw, 4rem)",
      lineHeight:'1.2'
    },
    h3:{
      fontWeight:"600",
      fontSize:"clamp(2.5rem,3vw, 5.5rem)",//TODO:Настроить
      lineHeight:'1.2'
    },
    headerButton:{
      fontWeight:"600",
      fontSize:"clamp(0.85rem,1.5vw, 1.1rem)",
      color:'var(--joy-palette-main-text)'
    },
    "buttonInv":{
      fontWeight:"600",
      fontSize:"clamp(0.8rem,2vw, 1rem)",
      color:'var(--joy-palette-text-inverted)'
    },

    "title-xl":{
      fontWeight:"600",
      fontSize:"clamp(1.2rem,2.5vw, 1.9rem)",
      color:'var(--joy-palette-main-text)',
        lineHeight:'1.1'
    },
    "title-lg":{
      fontWeight:"600",
      fontSize:"clamp(1rem,2.5vw, 1.2rem)",
        lineHeight:'1.1'
    },
    "body-md":{
      fontWeight:"400",
      fontSize:"clamp(0.8rem,2vw, 1rem)",
    },
    "info":{
      fontWeight:"400",
      fontSize:"clamp(0.7rem,2vw, 0.9rem)",
      color:'var(--joy-palette-main-text2)',
    }
  }
});

export default theme;
