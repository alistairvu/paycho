import {
  Box,
  Heading,
  Button,
  Flex,
  Spacer,
  useBreakpointValue,
  IconButton,
} from '@chakra-ui/react';
import type { ParticipantsOnEvents } from '@prisma/client';
import { useState } from 'react';
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';
import EventParticipantBox from './EventParticipantBox';

const EventParticipantsMini: React.FC<EventParticipantsMiniProps> = ({
  owner,
  participants,
  currency = 'USD',
}) => {
  const [isShown, setIsShown] = useState(false);
  const boxDisplay = useBreakpointValue({
    base: isShown ? 'block' : 'none',
    md: 'block',
  });

  return (
    <Box mb={2}>
      <Flex
        py={2}
        px={{ base: 4, md: 0 }}
        mb={1}
        align="center"
        background={{ base: 'gray.100', md: 'white' }}
        borderRadius={10}
      >
        <Heading size="md">Participants</Heading>
        <Spacer />
        <IconButton
          color="cyan.600"
          onClick={() => setIsShown((prev) => !prev)}
          display={{ base: 'inline-flex', md: 'none' }}
          aria-label={isShown ? 'Hide' : 'Show'}
          icon={isShown ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />}
          size="sm"
        />
      </Flex>
      <Box display={boxDisplay}>
        <Box
          borderRadius="md"
          borderColor="gray.200"
          borderWidth={1}
          borderBottomWidth={0}
        >
          {owner && (
            <EventParticipantBox
              isOwner
              participant={owner}
              currency={currency}
            />
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
        <Flex py={2}>
          <Button colorScheme="cyan" backgroundColor="cyan.600" color="white">
            Add
          </Button>
          <Button color="cyan.600" ml={1}>
            View all
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

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
