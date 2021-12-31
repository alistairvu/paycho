import type { GetServerSideProps, NextPage } from 'next';
import {
  Container,
  Heading,
  Box,
  Text,
  Skeleton,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { formatDistance } from 'date-fns';
import { getSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';

const EventDetails: NextPage = () => {
  const { query } = useRouter();
  const { id } = query;

  const { data: eventData, isLoading } = trpc.useQuery([
    'event.get-by-id',
    { id: id as string },
  ]);

  if (isLoading) {
    return (
      <Container maxW="4xl" centerContent>
        <Skeleton h={50} w="100%" />
      </Container>
    );
  }

  if (!eventData?.success) {
    return (
      <Container maxW="4xl" centerContent>
        <Box
          backgroundColor="red.100"
          w="100%"
          color="red.600"
          p={2}
          borderColor="red.600"
          borderRadius="lg"
          borderWidth={2}
        >
          <Heading>{eventData?.message}</Heading>
          <Text>Please try again later...</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" centerContent>
      <Box textAlign="left" width="100%">
        <Heading>{eventData.event?.name}</Heading>

        <Flex py={2}>
          <Text>created by {eventData.event?.owner.name}</Text>
          <Spacer />
          <Text>
            {formatDistance(
              new Date(eventData.event?.createdAt as Date),
              new Date(),
              {
                addSuffix: true,
              }
            )}
          </Text>
        </Flex>

        <Heading size="md">Participants</Heading>

        <Box>
          {eventData.event?.participants.map(
            (relation) => relation.participant.name
          )}
        </Box>
      </Box>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req } = ctx;
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: { destination: '/auth/signin' },
      props: {},
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default EventDetails;
