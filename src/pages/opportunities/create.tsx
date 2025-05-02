import { Box, Center, Spinner, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const CreateOpportunity = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      void router.push('/login');
      return;
    }

    if (status === 'authenticated' && !session.user?.isOnboardingCompleted) {
      void router.push('/onboarding');
      return;
    }

    if (status === 'authenticated' && session.user?.isWorker) {
      void router.push('/profile');
      return;
    }
  }, [status, router, session]);

  if (status === 'loading') {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Crear nueva oportunidad
      </Text>
      {/* Aquí irá el formulario de creación de oportunidades */}
    </Box>
  );
};

export default CreateOpportunity;
