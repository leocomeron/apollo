import Layout from '@/components/Layout/Layout';
import { OnboardingProvider } from '@/context/OnboardingContext';
import '@/styles/globals.css';
import theme from '@/theme/theme';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={0}
    >
      <ChakraProvider theme={theme}>
        <Head>
          <title>Manos a la obra</title>
        </Head>
        <OnboardingProvider>
          <Box minH="100vh">
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Box>
        </OnboardingProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}
