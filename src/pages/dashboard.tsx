import { SharedMeta } from '@/components/shared';
import { Container, Box } from '@chakra-ui/react';
import type { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { DashboardCreated } from '@/components/dashboard';

const Dashboard: NextPage = () => {
  const { status } = useSession();

  if (status === 'loading') {
    return null;
  }

  return (
    <>
      <SharedMeta title="Welcome" />
      <Container maxW="4xl" centerContent>
        <Box>
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
