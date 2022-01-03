import { Box, Heading } from '@chakra-ui/react';
import type { ParticipantsOnEvents } from '@prisma/client';
import EventParticipantBox from './EventParticipantBox';

const EventParticipantsMini: React.FC<EventParticipantsMiniProps> = ({
  owner,
  participants,
  currency = 'USD',
}) => (
  <>
    <Heading size="md" pb={2}>
      Participants
    </Heading>
    <Box
      borderRadius="md"
      borderColor="gray.200"
      borderWidth={1}
      borderBottomWidth={0}
    >
      {owner && (
        <EventParticipantBox isOwner participant={owner} currency={currency} />
      )}

      {participants
        ?.filter(({ participant }) => participant.id !== owner?.id)
        .map(({ participant }) => (
          <EventParticipantBox
            key={participant.id}
            participant={participant}
            currency={currency}
          />
        ))}
    </Box>
  </>
);

interface EventParticipantsMiniProps {
  owner:
    | {
        email: string | null;
        id: string;
        name: string | null;
        image: string | null;
      }
    | undefined;

  participants:
    | (ParticipantsOnEvents & {
        participant: {
          email: string | null;
          id: string;
          name: string | null;
          image: string | null;
        };
      })[]
    | undefined;

  currency?: string;
}

export default EventParticipantsMini;
