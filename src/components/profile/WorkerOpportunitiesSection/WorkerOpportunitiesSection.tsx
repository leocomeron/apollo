import fetcher from '@/lib/fetcher';
import { Opportunity } from '@/types/opportunities';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import useSWR from 'swr';
import OpportunityCard from '../OpportunityCard/OpportunityCard';

type ProposalStatus = 'pending' | 'accepted' | 'rejected';
type FilterStatus = 'pending' | 'accepted' | 'completed';

interface OpportunityWithProposal extends Opportunity {
  proposal: {
    id: string;
    budget: number;
    status: ProposalStatus;
    createdAt: string;
    updatedAt: string;
  };
}

const WorkerOpportunitiesSection: React.FC = () => {
  const { data: session } = useSession();
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('pending');

  const {
    data: opportunities,
    error,
    isLoading,
  } = useSWR<OpportunityWithProposal[]>(
    session?.user?.id
      ? `/api/opportunities/worker-applications?workerId=${session.user.id}`
      : null,
    fetcher,
    {
      revalidateOnMount: true,
    },
  );

  const getOpportunitiesByStatus = (status: FilterStatus) => {
    if (!opportunities) return [];

    switch (status) {
      case 'pending':
        return opportunities.filter(
          (opportunity) => opportunity.proposal.status === 'pending',
        );
      case 'accepted':
        return opportunities.filter(
          (opportunity) => opportunity.proposal.status === 'accepted',
        );
      case 'completed':
        return opportunities.filter(
          (opportunity) => opportunity.status === 'closed',
        );
      default:
        return [];
    }
  };

  const getStatusLabel = (status: FilterStatus) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'accepted':
        return 'Aceptada';
      case 'completed':
        return 'Finalizada';
    }
  };

  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case 'pending':
        return 'orange.500';
      case 'accepted':
        return 'green.500';
      case 'rejected':
        return 'red.500';
    }
  };

  if (isLoading) {
    return (
      <VStack spacing={6} align="stretch">
        <Text>Cargando mis propuestas...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">
          Mis Propuestas
        </Text>
        <Text color="red.500">Error al cargar las propuestas</Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="2xl" fontWeight="bold">
        Mis Propuestas
      </Text>

      <Box display="flex" gap={2}>
        {(['pending', 'accepted', 'completed'] as const).map((status) => (
          <Button
            key={status}
            variant={selectedStatus === status ? 'solid' : 'outline'}
            colorScheme="brand"
            onClick={() => setSelectedStatus(status)}
            flex={1}
          >
            {getStatusLabel(status)}s
          </Button>
        ))}
      </Box>

      <VStack spacing={4} align="stretch">
        {getOpportunitiesByStatus(selectedStatus).map((opportunity) => (
          <Box key={opportunity._id} position="relative">
            <OpportunityCard
              imageUrl={opportunity.images[0]}
              title={opportunity.title}
              createdAt={new Date(opportunity.createdAt)}
              id={opportunity._id}
              ownerFirstName={opportunity.ownerFirstName}
            />
            <Box
              position="absolute"
              top={2}
              right={2}
              bg={getStatusColor(opportunity.proposal.status)}
              color="white"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="sm"
              fontWeight="bold"
            >
              {opportunity.status === 'closed'
                ? 'Finalizada'
                : getStatusLabel(opportunity.proposal.status as FilterStatus)}
            </Box>
            <Box
              position="absolute"
              top={10}
              right={2}
              bg="white"
              color="gray.700"
              px={3}
              py={1}
              borderRadius="md"
              fontSize="sm"
              fontWeight="bold"
              border="1px solid"
              borderColor="gray.200"
            >
              ${opportunity.proposal.budget.toLocaleString()}
            </Box>
          </Box>
        ))}
      </VStack>

      {getOpportunitiesByStatus(selectedStatus).length === 0 && (
        <Box textAlign="center" py={8}>
          <Text fontSize="lg" color="gray.500" mb={2}>
            {`No tienes aplicaciones ${getStatusLabel(selectedStatus).toLowerCase()}.`}
          </Text>
          <Text fontSize="sm" color="gray.400">
            {selectedStatus === 'pending'
              ? 'Explora las oportunidades disponibles para comenzar.'
              : 'Continúa aplicando a nuevas oportunidades.'}
          </Text>
        </Box>
      )}
    </VStack>
  );
};

export default WorkerOpportunitiesSection;
