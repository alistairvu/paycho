import { Flex, Heading, Spacer } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
import HeaderButton from './HeaderButton';

const SharedHeader: React.FC = () => {
  const { status } = useSession();

  return (
    <Flex
      w="100%"
      p={4}
      shadow="lg"
      justify="between"
      align="center"
      background="white"
    >
      <NextLink href={status === 'authenticated' ? '/dashboard' : '/'} passHref>
        <Heading color="cyan.700" size="lg" cursor="pointer">
          paycho
        </Heading>
      </NextLink>

      <Spacer />

      <HeaderButton />
    </Flex>
  );
};

export default SharedHeader;
