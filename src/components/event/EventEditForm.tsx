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
  useToast,
} from '@chakra-ui/react';
import cc from 'currency-codes';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { trpc } from '@/utils/trpc';

type EventInputs = {
  name: string;
  currency: string;
};

const EventEditForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialName: string | undefined;
  initialCurrency: string | undefined;
}> = ({ isOpen, onClose, initialName, initialCurrency }) => {
  const toast = useToast();
  const utils = trpc.useContext();
  const { query } = useRouter();
  const { id } = query;
  console.log(id);

  const editEvent = trpc.useMutation(['event.update'], {
    onSuccess() {
      utils.invalidateQueries(['event.get-created']);
      // utils.invalidateQueries(['event.get-by-id', { id: id as string }]);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EventInputs>({
    defaultValues: {
      name: initialName ?? '',
      currency: initialCurrency ?? '',
    },
  });

  const onSubmit: SubmitHandler<EventInputs> = async (data) => {
    const result = await editEvent.mutateAsync({ ...data, id: id as string });

    if (result.success) {
      onClose();

      toast({
        title: 'Event successfully edited!',
        status: 'success',
        isClosable: true,
        duration: 2500,
      });
    } else {
      toast({
        title: 'An error occurred',
        status: 'error',
        isClosable: true,
        duration: 2500,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>Edit this Event</ModalHeader>
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
              type="submit"
              isLoading={isSubmitting}
              loadingText="Creating..."
            >
              Edit
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default EventEditForm;
