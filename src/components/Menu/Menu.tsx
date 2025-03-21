import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Menu() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { data: session } = useSession();

  const navigateTo = async (path: string) => {
    await router.push(path);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: '/',
        redirect: true,
      });
      onClose();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Flex justify="space-between" align="center" w="full" position="relative">
      <IconButton
        icon={<HamburgerIcon />}
        variant="outline"
        aria-label="Menu"
        onClick={onOpen}
      />

      {session ? (
        <Text px={4} color="gray.600" fontSize="medium">
          {session.user?.email}
        </Text>
      ) : (
        <Button
          onClick={() => void router.push('/login')}
          colorScheme="brand"
          variant="solid"
          size="md"
          mx={4}
        >
          Iniciar Sesión
        </Button>
      )}

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Navegación</DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="start" height="100%">
              {session?.user && (
                <Button variant="ghost" onClick={() => navigateTo('/profile')}>
                  Mi Perfil
                </Button>
              )}
              {session?.user && !session.user.isOnboardingCompleted && (
                <Button
                  variant="ghost"
                  onClick={() => navigateTo('/onboarding')}
                >
                  Onboarding
                </Button>
              )}
              <Button variant="ghost" onClick={() => navigateTo('/')}>
                Home
              </Button>
              <Divider />
              {session?.user ? (
                <Button
                  variant="ghost"
                  colorScheme="red"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              ) : (
                <Button variant="ghost" onClick={() => navigateTo('/login')}>
                  Iniciar Sesión
                </Button>
              )}
              <VStack marginTop="auto" width="100%" spacing={1}>
                <Divider />
                <Text fontSize="sm" color="gray.500">
                  {session?.user?.email}
                </Text>
              </VStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
