import {
  Flex,
  Button,
  Spacer,
  Heading,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react';
import { BsPlusLg } from 'react-icons/bs';
import DashboardCreateForm from './DashboardCreateForm';
import { EventContainer } from '../events';
import { inferQueryResponse } from '@/pages/api/trpc/[trpc]';

type EventsFromServer = inferQueryResponse<'event.get-created'>;

const DashboardCreated: React.FC<{ eventsData: EventsFromServer }> = ({
  eventsData,
}) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const buttonText = useBreakpointValue({
    base: 'Event',
    lg: 'New Event',
  });

  return (
    <>
      <Flex py={2}>
        <Heading size="lg">Created</Heading>
        <Spacer />
        <Button
          colorScheme="cyan"
          backgroundColor="cyan.600"
          color="white"
          onClick={onOpen}
          leftIcon={<BsPlusLg />}
        >
          {buttonText}
        </Button>

        <DashboardCreateForm isOpen={isOpen} onClose={onClose} />
      </Flex>
      {eventsData && eventsData.events && (
        <EventContainer events={eventsData?.events} />
      )}
    </>
  );
};

export default DashboardCreated;
