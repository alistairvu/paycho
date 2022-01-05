import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BsPlusLg } from 'react-icons/bs';
import { trpc } from '@/utils/trpc';

type ParticipantInput = {
  addedEmail: string;
};

const ParticipantAddForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ParticipantInput>();

  const { id } = router.query;

  const utils = trpc.useContext();
  const addUser = trpc.useMutation(['participant.add'], {
    onSuccess() {
      utils.invalidateQueries(['event.get-by-id', { id: id as string }]);
    },
  });

  const onSubmit: SubmitHandler<ParticipantInput> = async (data) => {
    await addUser.mutateAsync(
      { ...data, eventId: id as string },
      {
        onSuccess: () => {
          onClose();
          toast({
            title: 'Participant successfully added!',
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
          <ModalHeader>Add a Participant</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl p={2}>
              <FormLabel htmlFor="name">Email of Participant</FormLabel>
              <Input
                id="name"
                type="text"
                required
                {...register('addedEmail', { required: true })}
              />
              <FormHelperText>
                The email of the Google account you want to add.
              </FormHelperText>
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
              isLoading={isSubmitting}
              loadingText="Creating..."
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default ParticipantAddForm;
