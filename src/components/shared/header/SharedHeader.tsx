import { Flex, Heading, Spacer, Link } from '@chakra-ui/react';
import HeaderButton from './HeaderButton';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';

const SharedHeader: React.FC = () => {
  const { status } = useSession();

  return (
    <Flex p={4} shadow="lg" justify="between" align="center" background="white">
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