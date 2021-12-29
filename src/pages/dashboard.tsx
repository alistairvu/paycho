import { Container, Box, Heading } from '@chakra-ui/react';
import type { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { SharedMeta } from '@/components/shared';
import { DashboardCreated } from '@/components/dashboard';
import { trpc } from '@/utils/trpc';

const Dashboard: NextPage = () => {
  const { status } = useSession();
  const { data, isLoading } = trpc.useQuery(['hello.get', { text: 'naevis' }]);

  if (status === 'loading' || isLoading) {
    return null;
  }

  return (
    <>
      <SharedMeta title="Welcome" />
      <Container maxW="4xl" centerContent>
        <Box w="100%">
          <Heading>{data?.greeting}</Heading>
          <DashboardCreated />
        </Box>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req } = ctx;
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: { destination: '/' },
      props: {},
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default Dashboard;
