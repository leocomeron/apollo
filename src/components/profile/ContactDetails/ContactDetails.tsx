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
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

interface ContactDetailsProps {
  initialPhoneNumber: string;
  email: string;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
  initialPhoneNumber,
  email,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>(initialPhoneNumber);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSavePhoneNumber = () => {
    // Store the new phone via API
    onClose();
  };

  return (
    <Box>
      <VStack>
        <Text>Datos de contacto</Text>
        <Box display="flex" justifyContent="center" alignItems="center">
          <CallToAction
            minW={300}
            onClick={() => (window.location.href = `tel:${phoneNumber}`)}
          >
            {phoneNumber}{' '}
            <EditIcon
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              cursor="pointer"
              ml={2}
              boxSize={3}
              color="black"
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
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSavePhoneNumber}>
              Guardar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ContactDetails;
