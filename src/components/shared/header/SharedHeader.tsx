import {
  Flex,
  Heading,
  Button,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { useSession, signIn, signOut } from 'next-auth/react';

const SharedHeader: React.FC = () => {
  const { data: session, status } = useSession();

  const getButton = () => {
    if (status === 'loading') {
      return <Spacer />;
    }

    if (status === 'unauthenticated') {
      return (
        <Button
          colorScheme="cyan"
          backgroundColor="cyan.600"
          color="white"
          onClick={() => signIn()}
        >
          Get Started
        </Button>
      );
    }

    console.log(session?.user);

    return (
      <Menu>
        <MenuButton
          as={Button}
          colorScheme="cyan"
          backgroundColor="cyan.600"
          color="white"
        >
          {session?.user?.name}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => signOut()}>Sign Out</MenuItem>
        </MenuList>
      </Menu>
    );
  };

  return (
    <Flex p={4} shadow="lg" justify="between" align="center" background="white">
      <Heading color="cyan.700" size="lg">
        paycho
      </Heading>

      <Spacer />
      {getButton()}
    </Flex>
  );
};

export default SharedHeader;
