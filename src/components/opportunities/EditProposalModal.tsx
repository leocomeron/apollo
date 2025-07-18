import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

interface EditProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: string;
  currentBudget: number;
  currentStatus: string;
  onProposalUpdated: () => void;
}

export default function EditProposalModal({
  isOpen,
  onClose,
  proposalId,
  currentBudget,
  currentStatus,
  onProposalUpdated,
}: EditProposalModalProps) {
  const [budget, setBudget] = useState<number>(currentBudget);
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();

  const isRejected = currentStatus === 'rejected';

  const handleUpdate = async () => {
    if (budget <= 0) {
      toast({
        title: 'Error',
        description: 'El presupuesto debe ser mayor a 0',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (budget === currentBudget) {
      toast({
        title: 'Sin cambios',
        description: 'El presupuesto es el mismo que el anterior',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsUpdating(true);

      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budget: budget,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar la propuesta');
      }

      const successMessage = isRejected
        ? 'Tu propuesta ha sido actualizada y enviada nuevamente para revisión'
        : 'Tu presupuesto ha sido actualizado exitosamente';

      toast({
        title: 'Propuesta actualizada',
        description: successMessage,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      onProposalUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating proposal:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Error al actualizar la propuesta',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Actualizar Propuesta</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4}>
            <Text color="gray.600" textAlign="center">
              Ya tienes una propuesta para esta oportunidad. Puedes actualizar
              tu presupuesto aquí.
            </Text>

            {isRejected && (
              <Text
                color="orange.600"
                textAlign="center"
                fontSize="sm"
                p={3}
                bg="orange.50"
                rounded="md"
              >
                ⚠️ Tu propuesta fue rechazada anteriormente. Al actualizar el
                presupuesto, se enviará nuevamente para revisión.
              </Text>
            )}

            <FormControl isRequired>
              <FormLabel>Nuevo Presupuesto ($)</FormLabel>
              <NumberInput
                value={budget}
                onChange={(_, value) => setBudget(value || 0)}
                min={1}
                precision={0}
              >
                <NumberInputField placeholder="Ingresa tu nueva cotización" />
              </NumberInput>
              <Text fontSize="sm" color="gray.500" mt={1}>
                Presupuesto actual: ${currentBudget.toLocaleString()}
              </Text>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleUpdate}
            isLoading={isUpdating}
            loadingText="Actualizando..."
          >
            {isRejected ? 'Reenviar Propuesta' : 'Actualizar Propuesta'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
