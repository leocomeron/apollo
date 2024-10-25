import { OnboardingProvider } from '@/context/OnboardingContext';
import '@/styles/globals.css';
import theme from '@/theme/theme';
import { Box, ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Manos a la obra</title>
      </Head>
      <OnboardingProvider>
        <Box minH="100vh">
          <Component {...pageProps} />
        </Box>
      </OnboardingProvider>
    </ChakraProvider>
  );
}
