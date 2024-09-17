import '@/styles/globals.css';
import theme from '@/theme/theme';
import { Box, ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Box bg="gray.100" minH="100vh">
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  );
}
