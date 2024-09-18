import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontSize: { base: '10px', md: '24px' },
      },
    },
  },
  fonts: {
    heading: '"Agrandir", sans-serif',
    body: '"Agrandir", sans-serif',
  },
  colors: {
    brand: {
      50: '#fff4ec',
      100: '#ffe6d8',
      200: '#fcd4bd',
      300: '#fbc3a3',
      400: '#fac28d',
      500: '#f9d6ba',
      600: '#e4b594',
      700: '#d09b76',
      800: '#b5855d',
      900: '#9a6f44',
    },
  },
});

export default theme;
