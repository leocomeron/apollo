import fetcher from '@/lib/fetcher';
import { Proposal } from '@/types/proposal';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import EditProposalModal from './EditProposalModal';

interface SubmitProposalFormProps {
  opportunityId: string;
  onProposalSubmitted: () => void;
}

export default function SubmitProposalForm({
  opportunityId,
  onProposalSubmitted,
}: SubmitProposalFormProps) {
  const { data: session } = useSession();
  const [budget, setBudget] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingProposal, setExistingProposal] = useState<Proposal | null>(
    null,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Get user's proposals for this opportunity
  const { data: proposals, mutate: mutateProposals } = useSWR<Proposal[]>(
    opportunityId ? `/api/opportunities/${opportunityId}/proposals` : null,
    fetcher,
  );
  // Check if user already has a proposal for this opportunity
  useEffect(() => {
    if (proposals && session?.user?.id) {
      const userProposal = proposals.find(
        (proposal: Proposal) => proposal.workerId === session.user.id,
      );
      if (userProposal) {
        setExistingProposal(userProposal);
      } else {
        setExistingProposal(null);
      }
    }
  }, [proposals, session?.user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para enviar una propuesta',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // If user already has a proposal, show edit modal instead
    if (existingProposal) {
      onOpen();
      return;
    }

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

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workerId: session.user.id,
          opportunityId,
          budget,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar la propuesta');
      }

      toast({
        title: 'Propuesta enviada',
        description: 'Tu propuesta ha sido enviada exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setBudget(0);
      onProposalSubmitted();
      void mutateProposals();
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Error al enviar la propuesta',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProposalUpdated = () => {
    onProposalSubmitted();
    void mutateProposals();
  };

  return (
    <>
      <Box rounded="lg" shadow="base" p={6}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          {existingProposal ? 'Tu Propuesta Actual' : 'Enviar Propuesta'}
        </Text>

        {existingProposal ? (
          <Stack spacing={4}>
            <Box
              p={4}
              bg={existingProposal.status === 'rejected' ? 'red.50' : 'gray.50'}
              rounded="md"
              border={
                existingProposal.status === 'rejected' ? '1px solid' : 'none'
              }
              borderColor={
                existingProposal.status === 'rejected'
                  ? 'red.200'
                  : 'transparent'
              }
            >
              <Text fontSize="sm" color="gray.600" mb={1}>
                Presupuesto actual:
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                ${existingProposal.budget.toLocaleString()}
              </Text>
              <Text
                fontSize="sm"
                color={
                  existingProposal.status === 'rejected'
                    ? 'red.600'
                    : 'gray.500'
                }
                mt={1}
                fontWeight={
                  existingProposal.status === 'rejected' ? 'medium' : 'normal'
                }
              >
                Estado:{' '}
                {existingProposal.status === 'pending'
                  ? 'Pendiente'
                  : existingProposal.status === 'rejected'
                    ? 'Rechazada'
                    : existingProposal.status === 'accepted'
                      ? 'Aceptada'
                      : existingProposal.status}
              </Text>
            </Box>

            <Button
              colorScheme="brand"
              backgroundColor="brand.700"
              onClick={onOpen}
              size="lg"
              width="full"
            >
              {existingProposal.status === 'rejected'
                ? 'Actualizar y Reenviar'
                : 'Modificar Propuesta'}
            </Button>
          </Stack>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Presupuesto ($)</FormLabel>
                <NumberInput
                  value={budget}
                  onChange={(_, value) => setBudget(value || 0)}
                  min={1}
                  precision={0}
                >
                  <NumberInputField placeholder="Ingresa tu cotización" />
                </NumberInput>
              </FormControl>

              <Button
                type="submit"
                colorScheme="brand"
                backgroundColor="brand.700"
                isLoading={isSubmitting}
                loadingText="Enviando..."
                size="lg"
                width="full"
              >
                Enviar Propuesta
              </Button>
            </Stack>
          </form>
        )}
      </Box>

      {existingProposal && (
        <EditProposalModal
          isOpen={isOpen}
          onClose={onClose}
          proposalId={existingProposal.id}
          currentBudget={existingProposal.budget}
          currentStatus={existingProposal.status}
          onProposalUpdated={handleProposalUpdated}
        />
      )}
    </>
  );
}
