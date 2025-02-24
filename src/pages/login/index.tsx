import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  Input,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { data: session, status } = useSession();

  console.log('session:', session);

  if (status === 'loading') {
    return (
      <Center minH="100vh">
        <Text>Cargando...</Text>
      </Center>
    );
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignup) {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (res.ok) {
        const signInResult = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (signInResult?.ok) {
          void router.push('/onboarding');
        } else {
          toast({
            title: 'Error al iniciar sesión',
            description:
              'Se creó la cuenta pero hubo un error al iniciar sesión',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
        }
      } else {
        toast({
          title: 'Error al registrarse',
          description: 'Por favor, intente nuevamente',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      }
    } else {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        void router.push('/onboarding');
      } else {
        toast({
          title: 'Error al iniciar sesión',
          description: 'Email o contraseña inválidos',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      }
    }
  };

  return (
    <Center minH="100vh" p={6}>
      <Box
        w={{ base: '90%', md: '400px' }}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <VStack spacing={4}>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            {isSignup ? 'Crear Cuenta' : 'Inicia sesión'}
          </Text>

          <form onSubmit={handleAuth} style={{ width: '100%' }}>
            <VStack spacing={4} width="100%">
              <FormControl>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  size="lg"
                />
              </FormControl>
              <FormControl>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  size="lg"
                />
              </FormControl>
              <Button type="submit" colorScheme="orange" width="100%" size="lg">
                {isSignup ? 'Registrarse' : 'Iniciar Sesión'}
              </Button>
            </VStack>
          </form>

          <Divider my={4} />

          <Button
            variant="ghost"
            onClick={() => setIsSignup(!isSignup)}
            width="100%"
          >
            {isSignup
              ? '¿Ya tienes una cuenta? Inicia sesión'
              : 'Crear una cuenta'}
          </Button>

          <Button
            onClick={() => signIn('google')}
            width="100%"
            leftIcon={<Text>🌐</Text>}
          >
            Iniciar sesión con Google
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default AuthForm;
