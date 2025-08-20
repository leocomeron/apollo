import { GoogleSignInButton } from '@/components/common';
import { isValidEmail, isValidPassword } from '@/utils/strings';
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
import { useEffect, useState } from 'react';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { status } = useSession();

  // Handle authentication errors from URL params
  useEffect(() => {
    const { error } = router.query;
    if (error === 'auth') {
      toast({
        title: 'Error de autenticación',
        description:
          'Hubo un problema con el inicio de sesión. Por favor, intente nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  }, [router.query, toast]);

  if (status === 'loading') {
    return (
      <Center minH="100vh">
        <Text>Cargando...</Text>
      </Center>
    );
  }

  const validateForm = (email: string, password: string): boolean => {
    let isValid = true;

    if (!email) {
      setEmailError('El email es requerido');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Ingrese un email válido');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('La contraseña es requerida');
      isValid = false;
    } else if (isSignup && !isValidPassword(password)) {
      setPasswordError(
        'La contraseña debe tener al menos 8 caracteres y una letra',
      );
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(email, password)) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSignup) {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setEmailError('El email es requerido');
    } else if (!isValidEmail(value)) {
      setEmailError('Ingrese un email válido');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setPasswordError('La contraseña es requerida');
    } else if (isSignup && !isValidPassword(value)) {
      setPasswordError(
        'La contraseña debe tener al menos 8 caracteres y una letra',
      );
    } else {
      setPasswordError('');
    }
  };

  return (
    <Center p={{ base: 4, md: 6 }}>
      <Box
        w={{ base: '100%', md: '400px' }}
        p={{ base: 5, md: 8 }}
        borderRadius="lg"
        boxShadow="lg"
      >
        <VStack spacing={{ base: 3, md: 4 }}>
          <Text fontSize="2xl" fontWeight="bold" mb={{ base: 1, md: 2 }}>
            {isSignup ? 'Crear Cuenta' : 'Inicia sesión'}
          </Text>

          <form onSubmit={handleAuth} style={{ width: '100%' }}>
            <VStack spacing={{ base: 3, md: 4 }} width="100%">
              <FormControl isInvalid={!!emailError}>
                <Input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Correo electrónico"
                  size="lg"
                  h={{ base: '50px', md: '52px' }}
                  fontSize={{ base: 'md', md: 'md' }}
                />
                {emailError && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {emailError}
                  </Text>
                )}
              </FormControl>
              <FormControl isInvalid={!!passwordError}>
                <Input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Contraseña"
                  size="lg"
                  h={{ base: '50px', md: '52px' }}
                  fontSize={{ base: 'md', md: 'md' }}
                />
                {passwordError && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {passwordError}
                  </Text>
                )}
              </FormControl>
              <Button
                type="submit"
                colorScheme="orange"
                width="100%"
                size="lg"
                h={{ base: '50px', md: '52px' }}
                isLoading={isLoading}
                loadingText={
                  isSignup ? 'Registrando...' : 'Iniciando sesión...'
                }
              >
                {isSignup ? 'Registrarse' : 'Iniciar Sesión'}
              </Button>
            </VStack>
          </form>

          <Divider my={{ base: 3, md: 4 }} />
          <GoogleSignInButton />
          <Button
            variant="ghost"
            onClick={() => setIsSignup(!isSignup)}
            width="100%"
            size={{ base: 'sm', md: 'lg' }}
            h={{ base: '45px', md: '52px' }}
          >
            {isSignup
              ? '¿Ya tienes una cuenta? Inicia sesión'
              : 'Crear una cuenta'}
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default AuthForm;
