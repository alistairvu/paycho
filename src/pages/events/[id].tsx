import type { GetServerSideProps, NextPage } from 'next';
import {
  Container,
  Heading,
  Box,
  Text,
  Skeleton,
  Flex,
  SimpleGrid,
  Spacer,
  useBreakpointValue,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { formatDistance } from 'date-fns';
import { getSession, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { trpc } from '@/utils/trpc';
import { EventParticipantsMini, EventEditForm } from '@/components/event';
import { SharedMeta } from '@/components/shared';

const EventDetails: NextPage<Session> = () => {
  const { query } = useRouter();
  const { id } = query;
  const { data: sessionData } = useSession();

  const { onOpen, isOpen, onClose } = useDisclosure();
  const editButtonText = useBreakpointValue({
    base: 'Edit',
    lg: 'Edit Event',
  });

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
        <SharedMeta title="Error" />
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
      <SharedMeta title={eventData.event?.name ?? (id as string)} />

      <Box textAlign="left" width="100%">
        <Heading>{eventData.event?.name}</Heading>

        <Flex py={2} align="center">
          <Text>
            created{' '}
            {formatDistance(
              new Date(eventData.event?.createdAt as Date),
              new Date(),
              {
                addSuffix: true,
              }
            )}
          </Text>
          <Spacer />
          {sessionData?.user?.email === eventData.event?.owner?.email && (
            <>
              <Button
                colorScheme="cyan"
                backgroundColor="cyan.600"
                color="white"
                onClick={onOpen}
              >
                {editButtonText}
              </Button>
              <EventEditForm
                isOpen={isOpen}
                onClose={onClose}
                initialName={eventData.event?.name}
                initialCurrency={eventData.event?.currency}
              />
            </>
          )}
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Box>
            <EventParticipantsMini
              owner={eventData.event?.owner}
              participants={eventData.event?.participants}
              currency={eventData.event?.currency}
            />
          </Box>
        </SimpleGrid>
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
