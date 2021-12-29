import { ChakraProvider } from '@chakra-ui/provider';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { withTRPC } from '@trpc/next';
import SharedLayout from '@/components/shared/layout/SharedLayout';
import { AppRouter } from '@/server/routers';

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

const getBaseUrl = () => {
  if (process.browser) return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export default withTRPC<AppRouter>({
  config() {
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
    };
  },
  ssr: true,
})(MyApp);
