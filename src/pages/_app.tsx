import { ChakraProvider } from '@chakra-ui/provider';
import SharedLayout from '@/components/shared/layout/SharedLayout';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <SharedLayout>
          <Component {...pageProps} />
        </SharedLayout>
      </SessionProvider>
    </ChakraProvider>
  );
};

export default MyApp;
