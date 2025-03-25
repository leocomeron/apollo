import CallToAction from '@/components/CallToAction';
import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

interface ContactDetailsProps {
  initialPhoneNumber: string | undefined;
  email: string;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
  initialPhoneNumber,
  email,
}) => {
  const { data: session } = useSession();
  const toast = useToast();
  const [phoneNumber, setPhoneNumber] = useState<string>(
    initialPhoneNumber || 'Sin número',
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { trigger: updatePhoneNumber, isMutating } = useSWRMutation(
    '/api/users',
    async (url) => {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          contact: {
            phone: phoneNumber,
            location: session?.user?.contact?.location || '',
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update phone number');
      }

      return data;
    },
  );

  const handleSavePhoneNumber = async () => {
    try {
      await updatePhoneNumber();
      onClose();
      toast({
        title: 'Número de teléfono actualizado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error al actualizar el número de teléfono',
        description:
          error instanceof Error
            ? error.message
            : 'Por favor intente nuevamente',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, ''); // Remove any non-numeric character
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  return (
    <Box>
      <VStack>
        <Text>Datos de contacto</Text>
        <Box display="flex" justifyContent="center" alignItems="center">
          <CallToAction minW={300} onClick={() => openWhatsApp(phoneNumber)}>
            {phoneNumber}{' '}
            <EditIcon
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              cursor={isMutating ? 'not-allowed' : 'pointer'}
              ml={2}
              boxSize={3}
              color="black"
              opacity={isMutating ? 0.5 : 1}
              aria-label="Editar número de teléfono"
            />
          </CallToAction>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <CallToAction
            minW={300}
            onClick={() => (window.location.href = `mailto:${email}`)}
          >
            {email}
          </CallToAction>
        </Box>
      </VStack>

      {/* Modal for editing phone number */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar número de teléfono</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Ingrese nuevo número de teléfono"
              isDisabled={isMutating}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSavePhoneNumber}
              isLoading={isMutating}
            >
              Guardar
            </Button>
            <Button variant="ghost" onClick={onClose} isDisabled={isMutating}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ContactDetails;
