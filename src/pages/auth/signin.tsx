import { Box, Flex, Button, Heading, Spacer, Text } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';

const SignIn: NextPage = () => {
  return (
    <Flex h="80vh" direction="column">
      <Spacer />
      <Flex>
        <Spacer />
        <Box shadow="md" p={4} align="center">
          <Heading>Get started with Paycho</Heading>
          <Box h={2} />
          <Text>Use your Google account to get started with Paycho</Text>

          <Box h={4} />

          <Flex>
            <Spacer />
            <Button
              leftIcon={<FaGoogle />}
              colorScheme="red"
              onClick={() => signIn('google')}
            >
              Sign in with Google
            </Button>
            <Spacer />
          </Flex>
        </Box>
        <Spacer />
      </Flex>
      <Spacer />
    </Flex>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req } = ctx;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: '/' },
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default SignIn;
