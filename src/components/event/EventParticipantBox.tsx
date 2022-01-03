import { Flex, Text, Spacer } from '@chakra-ui/react';

interface EventParticipantBoxProps {
  isOwner?: boolean;
  participant: {
    email: string | null;
    id: string;
    name: string | null;
    image: string | null;
  };
  currency: string;
}

const EventParticipantBox: React.FC<EventParticipantBoxProps> = ({
  isOwner,
  participant,
  currency,
}) => (
  <Flex
    borderColor="gray.200"
    borderBottomWidth={1}
    padding={2}
    key={participant.id}
  >
    <Flex direction="column">
      <Text fontWeight={isOwner ? 'semibold' : 'normal'}>
        {participant.name}
      </Text>
    </Flex>
    <Spacer />
    <Text>0.00 {currency}</Text>
  </Flex>
);

export default EventParticipantBox;
