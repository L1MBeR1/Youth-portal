import { extendTheme } from '@mui/joy/styles';

const theme = extendTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      mdx: 1000, 
      lg: 1200,
      xl: 1536,
			xxl:1920
    },
  },
});

export default theme;
