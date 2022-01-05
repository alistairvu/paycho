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
  const router = useRouter();
  const { id } = router.query;

  const editEvent = trpc.useMutation(['event.update'], {
    onSuccess() {
      utils.invalidateQueries(['event.get-created']);
      utils.invalidateQueries(['event.get-by-id', { id: id as string }]);
    },
  });

  const deleteEvent = trpc.useMutation(['event.delete'], {
    onSuccess() {
      utils.invalidateQueries(['event.get-created']);
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

  const onDelete = async () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Do you want to delete this event?')) {
      await deleteEvent.mutateAsync(
        { id: id as string },
        {
          onSuccess: () => {
            onClose();

            toast({
              title: 'Event successfully deleted!',
              status: 'success',
              isClosable: true,
              duration: 2500,
            });

            router.push('/dashboard');
          },

          onError: (error) => {
            toast({
              title: error.message
                ? `An error occurred: ${error.message}`
                : 'An error occurred',
              status: 'error',
              isClosable: true,
              duration: 2500,
            });
          },
        }
      );
    }
  };

  const onSubmit: SubmitHandler<EventInputs> = async (data) => {
    await editEvent.mutateAsync(
      { ...data, id: id as string },
      {
        onSuccess: () => {
          onClose();
          toast({
            title: 'Event successfully edited!',
            status: 'success',
            isClosable: true,
            duration: 2500,
          });
        },

        onError: (error) => {
          toast({
            title: error.message
              ? `An error occurred: ${error.message}`
              : 'An error occurred',
            status: 'error',
            isClosable: true,
            duration: 2500,
          });
        },
      }
    );
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
            <Button variant="ghost" onClick={onClose} me={1}>
              Close
            </Button>

            <Button
              colorScheme="red"
              backgroundColor="red.500"
              color="white"
              isLoading={deleteEvent.isLoading}
              onClick={() => onDelete()}
              loadingText="Deleting..."
              me={1}
            >
              Delete
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
