import { extendTheme } from '@mui/joy/styles';

const theme = extendTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      smx:750,
      md: 900,
      mdx: 1050, 
      lg: 1200,
      lgx:1350,
      xl: 1536,
			xxl:2000
    },
  },
});

export default theme;
