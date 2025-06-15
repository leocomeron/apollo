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

interface OpportunityPageProps {
  opportunity: Opportunity;
  categories: Category[];
}

const mockProposals = [
  {
    id: '1',
    name: 'Juan',
    lastName: 'Pérez',
    profileImage:
      'https://img.freepik.com/fotos-premium/trabajador-construccion-casco-amarillo_58409-13665.jpg',
    budget: 150000,
    reviewStats: {
      totalReviews: 25,
      averageRating: 4.5,
      breakdown: [
        { score: 5, count: 15 },
        { score: 4, count: 7 },
        { score: 3, count: 2 },
        { score: 2, count: 1 },
        { score: 1, count: 0 },
      ],
    },
  },
  {
    id: '2',
    name: 'María',
    lastName: 'González',
    profileImage:
      'https://img.freepik.com/fotos-premium/trabajador-construccion-casco-amarillo_58409-13665.jpg',
    budget: 180000,
    reviewStats: {
      totalReviews: 18,
      averageRating: 4.8,
      breakdown: [
        { score: 5, count: 12 },
        { score: 4, count: 5 },
        { score: 3, count: 1 },
        { score: 2, count: 0 },
        { score: 1, count: 0 },
      ],
    },
  },
];

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

  const handleAcceptProposal = (proposalId: string) => {
    console.log('Accept proposal:', proposalId);
  };

  const handleRejectProposal = (proposalId: string) => {
    console.log('Reject proposal:', proposalId);
  };
  console.log(opportunity);
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
              {mockProposals.map((proposal) => (
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
              ))}
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
