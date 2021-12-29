import {
  Spacer,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Image,
  MenuItem,
  IconButton,
  MenuDivider,
} from '@chakra-ui/react';
import { useSession, signIn, signOut } from 'next-auth/react';

const HeaderButton: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Spacer h={10} />;
  }

  if (status === 'unauthenticated') {
    return (
      <Button
        colorScheme="cyan"
        backgroundColor="cyan.600"
        color="white"
        onClick={() => signIn()}
        h={10}
      >
        Get Started
      </Button>
    );
  }

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={
          <Image
            src={session?.user?.image!}
            alt={session?.user?.name!}
            h={10}
            borderRadius="full"
          />
        }
        h={10}
      />
      <MenuList>
        <MenuItem fontWeight="bold" color="black">
          {session?.user?.name}
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => signOut()}>Sign Out</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default HeaderButton;
