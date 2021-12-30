import {
  LinkOverlay,
  LinkBox,
  Heading,
  Flex,
  Spacer,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { formatDistance } from 'date-fns';
import type { EventWithOwner } from '@/@types';

const EventCard: React.FC<{ event: EventWithOwner }> = ({ event }) => (
  <LinkBox
    as="article"
    p={{ base: 2, md: 4 }}
    borderBottomColor="gray.200"
    borderBottomWidth={1}
    _hover={{ background: 'gray.50' }}
  >
    <Heading size="md">
      <NextLink href={`/events/${event.id}`} passHref>
        <LinkOverlay>{event.name}</LinkOverlay>
      </NextLink>
    </Heading>
    <Flex>
      <Text>
        {formatDistance(new Date(event.createdAt), new Date(), {
          addSuffix: true,
        })}
      </Text>
      <Spacer />
      by {event.owner.name}{' '}
    </Flex>
  </LinkBox>
);

export default EventCard;
