import { useRouter } from 'next/router';
import {
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

export default function Menu() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const navigateTo = async (path: string) => {
    await router.push(path);
    onClose();
  };

  return (
    <>
      <IconButton
        icon={<HamburgerIcon />}
        variant="outline"
        aria-label="Menu"
        position="absolute"
        top={4}
        left={4}
        onClick={onOpen}
      />

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Navegación</DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="start">
              <Button variant="ghost" onClick={() => navigateTo('/profile')}>
                Mi Perfil
              </Button>
              <Button variant="ghost" onClick={() => navigateTo('/onboarding')}>
                Onboarding
              </Button>
              <Button variant="ghost" onClick={() => navigateTo('/')}>
                Home
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
