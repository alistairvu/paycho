import { ChakraProvider } from '@chakra-ui/provider';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import SharedLayout from '@/components/shared/layout/SharedLayout';

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => (
  <ChakraProvider>
    <SessionProvider session={session}>
      <SharedLayout>
        <Component {...pageProps} />
      </SharedLayout>
    </SessionProvider>
  </ChakraProvider>
);

export default MyApp;
