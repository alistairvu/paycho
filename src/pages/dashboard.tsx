import { Container, Box, Skeleton } from '@chakra-ui/react';
import type { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { SharedMeta } from '@/components/shared';
import { DashboardCreated } from '@/components/dashboard';
import { trpc } from '@/utils/trpc';

const Dashboard: NextPage = () => {
  const { status } = useSession();

  const { isLoading: isCreatedLoading, data: createdData } = trpc.useQuery([
    'event.get-created',
  ]);

  if (status === 'loading' || isCreatedLoading || !createdData) {
    return (
      <>
        <SharedMeta title="Welcome" />
        <Container maxW="4xl" centerContent>
          <Skeleton h={50} w="100%" />
        </Container>
      </>
    );
  }

  return (
    <>
      <SharedMeta title="Welcome" />
      <Container maxW="4xl" centerContent>
        <Box w="100%">
          <DashboardCreated eventsData={createdData} />
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
