import { SharedMeta } from '@/components/shared';
import { Heading, Container, Box } from '@chakra-ui/react';
import type { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { DashboardCreated } from '@/components/dashboard';

const Dashboard: NextPage = (props) => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  return (
    <>
      <SharedMeta title="Welcome" />
      <Container maxW="4xl" centerContent>
        <Box>
          <Heading size="2xl">
            Welcome to your dashboard, {session?.user?.name}!
          </Heading>

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
