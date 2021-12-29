import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormHelperText,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import cc from 'currency-codes';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BsPlusLg } from 'react-icons/bs';
import { trpc } from '@/utils/trpc';

type EventInputs = {
  name: string;
  currency: string;
};

const DashboardCreateForm: React.FC<{ isOpen: boolean; onClose: () => void }> =
  ({ isOpen, onClose }) => {
    const { register, handleSubmit } = useForm<EventInputs>();
    const addEvent = trpc.useMutation(['event.add']);

    const onSubmit: SubmitHandler<EventInputs> = async (data) => {
      const result = await addEvent.mutateAsync(data);
      console.log(result);
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>Create a new Event</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <FormControl p={2}>
                <FormLabel htmlFor="name">Name of event</FormLabel>
                <Input
                  id="name"
                  type="text"
                  required
                  {...register('name', { required: true })}
                />
                <FormHelperText>Give your event a nice name.</FormHelperText>
              </FormControl>

              <FormControl p={2}>
                <FormLabel htmlFor="name">Currency</FormLabel>
                <Select
                  id="currency"
                  placeholder="Select currency"
                  {...register('currency', { required: true })}
                >
                  {cc.codes().map((code) => (
                    <option key={code}>{code}</option>
                  ))}
                </Select>
                <FormHelperText>Select a currency.</FormHelperText>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>

              <Button
                colorScheme="cyan"
                backgroundColor="cyan.600"
                color="white"
                leftIcon={<BsPlusLg />}
                type="submit"
              >
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    );
  };

export default DashboardCreateForm;
