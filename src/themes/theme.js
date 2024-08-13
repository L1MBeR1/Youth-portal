import { extendTheme } from '@mui/joy/styles';

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
    light: {
      palette: {
        neutral: {
          main: "#F3FFEF",
          second:"#0C0D10",
        },
        primary:{
        solidBg: '#0C0D10',
        solidBorder: '#0C0D10',
        solidHoverBg: '#6F6F77',
        solidHoverBorder: '#6F6F77',
        solidActiveBg: '#0C0D10',
        solidActiveBorder: '#0C0D10',
        solidDisabledBg: '#b8b8c1',
        solidDisabledBorder: '#b8b8c1',
        }
      }
    },
    dark: {
      palette: {
        neutral: {
        main: "#101115",
        second:"#F3FFEF",
        primary:{
          solidBg: '#F3FFEF',
          solidBorder: '#0d6efd',
          solidHoverBg: '#2A2A30',
          solidHoverBorder: '#0a58ca',
          solidActiveBg: '#0a58ca',
          solidActiveBorder: '#0a53be',
          solidDisabledBg: '#0d6efd',
          solidDisabledBorder: '#0d6efd',
          }
      }}
    }
  },
  staticColors: {
    mainWhite: '#F3FFEF',
    mainBlack: '#0C0D10',
  },
});

export default theme;
