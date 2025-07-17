import DeleteButton from '@/components/common/DeleteButton';
import EditButton from '@/components/common/EditButton';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import CloseOpportunityModal from '@/components/opportunities/CloseOpportunityModal';
import EditOpportunityForm from '@/components/opportunities/EditOpportunityForm';
import OpportunityPreview from '@/components/opportunities/OpportunityPreview';
import ProposalCard from '@/components/opportunities/ProposalCard';
import SubmitProposalForm from '@/components/opportunities/SubmitProposalForm';
import fetcher from '@/lib/fetcher';
import { deleteOpportunity, updateOpportunity } from '@/services/opportunities';
import { updateAllProposalsForOpportunity } from '@/services/proposals';
import { Category } from '@/types/onboarding';
import { Opportunity, OpportunityFormData } from '@/types/opportunities';
import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

interface Proposal {
  id: string;
  workerId: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  budget: number;
  reviewStats: {
    totalReviews: number;
    averageRating: number;
    breakdown: Array<{ score: number; count: number }>;
  };
  status: 'pending' | 'accepted' | 'rejected';
}

export default function OpportunityPage() {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isReviewOpen,
    onOpen: onReviewOpen,
    onClose: onReviewClose,
  } = useDisclosure();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;

  // Local state only for editing
  const [editedOpportunity, setEditedOpportunity] =
    useState<OpportunityFormData | null>(null);

  // Get opportunity data
  const {
    data: opportunity,
    error: opportunityError,
    isLoading: isLoadingOpportunity,
  } = useSWR<Opportunity>(id ? `/api/opportunities/${id}` : null, fetcher);

  // Get categories data
  const {
    data: categories,
    error: categoriesError,
    isLoading: isLoadingCategories,
  } = useSWR<Category[]>('/api/catalogs/categories', fetcher);

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const {
    data: proposals,
    error: proposalsError,
    isLoading: isLoadingProposals,
  } = useSWR<Proposal[]>(
    id ? `/api/opportunities/${id}/proposals` : null,
    fetcher,
  );

  // Loading state
  if (isLoadingOpportunity || isLoadingCategories) {
    return (
      <Container maxW="container.xl">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minH="400px"
        >
          <Spinner size="xl" color="brand.500" />
        </Box>
      </Container>
    );
  }

  // Error state
  if (opportunityError || categoriesError) {
    return (
      <Container maxW="container.xl">
        <Box textAlign="center" py={10}>
          <Text fontSize="xl" color="red.500">
            Error al cargar la oportunidad
          </Text>
        </Box>
      </Container>
    );
  }

  // Not found state
  if (!opportunity || !categories) {
    return (
      <Container maxW="container.xl">
        <Box textAlign="center" py={10}>
          <Text fontSize="xl">Oportunidad no encontrada</Text>
        </Box>
      </Container>
    );
  }

  // Check if current user is the owner of the opportunity
  const isOwner = session?.user?.id === opportunity.userId?.toString();

  // Get the accepted proposal (worker to review)
  const acceptedProposal = proposals?.find((p) => p.status === 'accepted');

  const handleCloseAndReview = () => {
    if (!acceptedProposal) {
      toast({
        title: 'Error',
        description: 'No se encontró una propuesta aceptada para evaluar',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onReviewOpen();
  };

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      // Update opportunity status to "in_progress"
      await updateOpportunity(opportunity._id, {
        ...opportunity,
        status: 'in_progress',
      });

      // Update all proposals for this opportunity
      await updateAllProposalsForOpportunity(opportunity._id, proposalId);

      // Refresh opportunity data using SWR mutate
      await mutate(`/api/opportunities/${id}`);
      // Refresh proposals data using SWR mutate
      await mutate(`/api/opportunities/${opportunity._id}/proposals`);

      toast({
        title: 'Propuesta aceptada',
        description: 'La oportunidad ha sido marcada como en progreso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error accepting proposal:', error);
      toast({
        title: 'Error al aceptar la propuesta',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRejectProposal = async (proposalId: string) => {
    try {
      // Update the specific proposal to 'rejected' status
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (!response.ok) {
        throw new Error('Error al rechazar la propuesta');
      }

      // Refresh proposals data using SWR mutate
      await mutate(`/api/opportunities/${opportunity._id}/proposals`);

      toast({
        title: 'Propuesta rechazada',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      toast({
        title: 'Error al rechazar la propuesta',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSave = async () => {
    if (!editedOpportunity) return;

    try {
      setIsSaving(true);
      await updateOpportunity(opportunity._id, editedOpportunity);

      // Refresh opportunity data using SWR mutate
      await mutate(`/api/opportunities/${id}`);

      toast({
        title: 'Oportunidad actualizada',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setEditedOpportunity(null);
      onClose();
    } catch (error) {
      console.error('Error al actualizar la oportunidad:', error);
      toast({
        title: 'Error al actualizar la oportunidad',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      setIsAlertOpen(false);
      await deleteOpportunity(opportunity._id);

      toast({
        title: 'Oportunidad eliminada',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      await router.push('/profile');
    } catch (error) {
      console.error('Error al eliminar la oportunidad:', error);
      toast({
        title: 'Error al eliminar la oportunidad',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleProposalSubmitted = () => {
    // Refresh proposals data after submission
    void mutate(`/api/opportunities/${opportunity._id}/proposals`);
  };

  return (
    <Container maxW="container.xl">
      <Grid
        templateColumns={{ base: '1fr', md: '1fr', lg: '2fr 1fr' }}
        gap={{ base: 6, lg: 8 }}
      >
        <GridItem>
          <VStack align="stretch" spacing={4}>
            <Box position="relative" w="100%">
              <Box display="flex" justifyContent="flex-end" mb={1}>
                {isOwner && opportunity.status === 'open' && (
                  <HStack spacing={2}>
                    <EditButton
                      onClick={() => {
                        setEditedOpportunity(opportunity);
                        onOpen();
                      }}
                    />
                    <DeleteButton
                      onClick={handleDelete}
                      isLoading={isDeleting}
                    />
                  </HStack>
                )}
              </Box>
              <OpportunityPreview
                formData={opportunity}
                categories={categories}
              />
            </Box>
          </VStack>
        </GridItem>

        <GridItem>
          <VStack spacing={4} align="stretch">
            {/* Show different content based on ownership */}
            {isOwner ? (
              /* Owner view - Show proposals */
              <>
                <Box rounded="lg" shadow="base" p={4}>
                  <Text fontSize="xl" fontWeight="bold" mb={2}>
                    Propuestas de interesados
                  </Text>
                  <VStack spacing={4} align="stretch">
                    {isLoadingProposals ? (
                      <Text>Cargando propuestas...</Text>
                    ) : proposalsError ? (
                      <Text color="red.500">
                        Error al cargar las propuestas
                      </Text>
                    ) : proposals?.length === 0 ? (
                      <Text>No hay propuestas aún</Text>
                    ) : (
                      proposals
                        ?.sort((a, b) => {
                          // Sort: accepted first, then pending, then rejected
                          const statusOrder = {
                            accepted: 0,
                            pending: 1,
                            rejected: 2,
                          };
                          return statusOrder[a.status] - statusOrder[b.status];
                        })
                        .map((proposal) => (
                          <ProposalCard
                            key={proposal.id}
                            firstName={proposal.firstName}
                            lastName={proposal.lastName}
                            profileImage={proposal.profileImage}
                            budget={proposal.budget}
                            reviewStats={proposal.reviewStats}
                            status={proposal.status}
                            onAccept={() => handleAcceptProposal(proposal.id)}
                            onReject={() => handleRejectProposal(proposal.id)}
                          />
                        ))
                    )}
                  </VStack>
                </Box>

                {/* Close and Review Button */}
                {opportunity.status === 'in_progress' && acceptedProposal && (
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      colorScheme="brand"
                      backgroundColor="brand.700"
                      onClick={handleCloseAndReview}
                      size="md"
                    >
                      Cerrar y Evaluar
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              /* Non-owner view - Show proposal form or status */
              <>
                {opportunity.status === 'open' ? (
                  session?.user?.isWorker ? (
                    <SubmitProposalForm
                      opportunityId={opportunity._id}
                      onProposalSubmitted={handleProposalSubmitted}
                    />
                  ) : (
                    <Box rounded="lg" shadow="base" p={6} textAlign="center">
                      <Text fontSize="lg" fontWeight="bold" mb={2}>
                        Solo trabajadores pueden enviar propuestas
                      </Text>
                    </Box>
                  )
                ) : (
                  <Box rounded="lg" shadow="base" p={6} textAlign="center">
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                      Esta oportunidad ya no está disponible
                    </Text>
                    <Text color="gray.600">
                      {opportunity.status === 'in_progress'
                        ? 'La oportunidad está en progreso'
                        : 'La oportunidad ha sido cerrada'}
                    </Text>
                  </Box>
                )}
              </>
            )}
          </VStack>
        </GridItem>
      </Grid>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setEditedOpportunity(null);
          onClose();
        }}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar oportunidad</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setEditedOpportunity(null);
              onClose();
            }}
          />
          <ModalBody>
            <EditOpportunityForm
              categories={categories}
              formData={editedOpportunity || opportunity}
              onFormChange={setEditedOpportunity}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <DeleteConfirmationModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Eliminar oportunidad"
        message="¿Estás seguro de que deseas eliminar esta oportunidad?"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      {/* Close Opportunity Modal */}
      <CloseOpportunityModal
        isOpen={isReviewOpen}
        onClose={onReviewClose}
        acceptedProposal={acceptedProposal}
        opportunityId={opportunity._id}
        formData={opportunity}
        onOpportunityUpdate={() => mutate(`/api/opportunities/${id}`)}
      />
    </Container>
  );
}
