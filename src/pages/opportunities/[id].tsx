import DeleteButton from '@/components/common/DeleteButton';
import EditButton from '@/components/common/EditButton';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import EditOpportunityForm from '@/components/opportunities/EditOpportunityForm';
import OpportunityPreview from '@/components/opportunities/OpportunityPreview';
import ProposalCard from '@/components/opportunities/ProposalCard';
import fetcher from '@/lib/fetcher';
import { getCategories } from '@/services/catalogs';
import { deleteOpportunity, updateOpportunity } from '@/services/opportunities';
import { Category } from '@/types/onboarding';
import { Opportunity, OpportunityFormData } from '@/types/opportunities';
import {
  Box,
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
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';

interface OpportunityPageProps {
  opportunity: Opportunity;
  categories: Category[];
}

interface Proposal {
  id: string;
  name: string;
  lastName: string;
  profileImage: string;
  budget: number;
  reviewStats: {
    totalReviews: number;
    averageRating: number;
    breakdown: Array<{ score: number; count: number }>;
  };
  status: string;
}

export default function OpportunityPage({
  opportunity,
  categories,
}: OpportunityPageProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = useState<OpportunityFormData>({
    images: opportunity.images,
    title: opportunity.title,
    description: opportunity.description,
    categories: opportunity.categories,
    location: opportunity.location,
    type: opportunity.type,
    startDate: opportunity.startDate,
    status: opportunity.status,
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const {
    data: proposals,
    error: proposalsError,
    isLoading: isLoadingProposals,
  } = useSWR<Proposal[]>(
    `/api/opportunities/${opportunity._id}/proposals`,
    fetcher,
  );

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      // TODO: Implement accept proposal logic
      console.log('Accept proposal:', proposalId);
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
      // TODO: Implement reject proposal logic
      console.log('Reject proposal:', proposalId);
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
    try {
      setIsSaving(true);
      await updateOpportunity(opportunity._id, formData);

      toast({
        title: 'Oportunidad actualizada',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

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
                <HStack spacing={2}>
                  <EditButton onClick={onOpen} />
                  <DeleteButton onClick={handleDelete} isLoading={isDeleting} />
                </HStack>
              </Box>
              <OpportunityPreview formData={formData} categories={categories} />
            </Box>
          </VStack>
        </GridItem>

        <GridItem>
          <Box rounded="lg" shadow="base" p={4}>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Propuestas de interesados
            </Text>
            <VStack spacing={4} align="stretch">
              {isLoadingProposals ? (
                <Text>Cargando propuestas...</Text>
              ) : proposalsError ? (
                <Text color="red.500">Error al cargar las propuestas</Text>
              ) : proposals?.length === 0 ? (
                <Text>No hay propuestas aún</Text>
              ) : (
                proposals?.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    name={proposal.name}
                    lastName={proposal.lastName}
                    profileImage={proposal.profileImage}
                    budget={proposal.budget}
                    reviewStats={proposal.reviewStats}
                    onAccept={() => handleAcceptProposal(proposal.id)}
                    onReject={() => handleRejectProposal(proposal.id)}
                  />
                ))
              )}
            </VStack>
          </Box>
        </GridItem>
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar oportunidad</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EditOpportunityForm
              categories={categories}
              formData={formData}
              onFormChange={setFormData}
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
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { id } = context.params as { id: string };

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  try {
    const [opportunity, categories] = await Promise.all([
      fetcher(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/${id}`),
      getCategories(),
    ]);

    return {
      props: {
        opportunity,
        categories,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};
