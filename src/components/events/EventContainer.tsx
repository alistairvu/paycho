import { Box } from '@chakra-ui/react';
import EventCard from './EventCard';
import type { EventWithOwner } from '@/@types';

const EventContainer: React.FC<{ events: EventWithOwner[] }> = ({ events }) => (
  <Box
    borderRadius="md"
    borderColor="gray.200"
    borderWidth={1}
    borderBottomWidth={0}
  >
    {events.map((event) => (
      <EventCard event={event} key={event.id} />
    ))}
  </Box>
);

export default EventContainer;
