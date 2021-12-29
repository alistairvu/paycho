import { Heading } from '@chakra-ui/react';
import type { GetServerSideProps, NextPage } from 'next';

import { SharedMeta } from '@/components/shared';
import { getSession } from 'next-auth/react';

const Home: NextPage = () => {
  return (
    <div>
      <SharedMeta title="Welcome" />
      <Heading size="4xl">This is the current home page</Heading>
      <main />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req } = ctx;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: '/dashboard' },
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default Home;
