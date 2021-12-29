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

const DashboardCreated: React.FC = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const buttonText = useBreakpointValue({
    base: 'Event',
    lg: 'New Event',
  });

  return (
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
  );
};

export default DashboardCreated;
