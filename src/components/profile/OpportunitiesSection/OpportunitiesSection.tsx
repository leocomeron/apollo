import fetcher from '@/lib/fetcher';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';
import CallToAction from '../../CallToAction/CallToAction';
import OpportunityCard from '../OpportunityCard/OpportunityCard';

interface Opportunity {
  _id: string;
  title: string;
  images: string[];
  createdAt: string;
  status: 'open' | 'in_progress' | 'closed';
  description: string;
  categories: string[];
  location: string;
  type: string;
  startDate: string;
}

type OpportunityStatus = Opportunity['status'];

const OpportunitiesSection: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<OpportunityStatus>('open');

  const {
    data: opportunities,
    error,
    isLoading,
  } = useSWR<Opportunity[]>(
    session?.user?.id ? `/api/opportunities?userId=${session.user.id}` : null,
    fetcher,
    {
      revalidateOnMount: true,
    },
  );

  const handleCreateOpportunity = async () => {
    setIsRedirecting(true);
    await router.push('/opportunities/create');
    setIsRedirecting(false);
  };

  const getOpportunitiesByStatus = (status: OpportunityStatus) =>
    opportunities?.filter((opportunity) => opportunity.status === status) || [];

  const getStatusLabel = (status: OpportunityStatus) => {
    switch (status) {
      case 'open':
        return 'Abiertas';
      case 'in_progress':
        return 'En Curso';
      case 'closed':
        return 'Cerradas';
    }
  };

  if (isLoading) {
    return (
      <VStack spacing={6} align="stretch">
        <Text>Cargando oportunidades...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">
          Mis Oportunidades
        </Text>
        <Text color="red.500">Error al cargar las oportunidades</Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="2xl" fontWeight="bold">
        Mis Oportunidades
      </Text>

      <Box display="flex" gap={4}>
        <CallToAction
          onClick={handleCreateOpportunity}
          isLoading={isRedirecting}
          loadingText="Cargando..."
        >
          Crear nueva oportunidad
        </CallToAction>
      </Box>

      <Box display="flex" gap={2}>
        {(['open', 'in_progress', 'closed'] as OpportunityStatus[]).map(
          (status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? 'solid' : 'outline'}
              colorScheme="brand"
              onClick={() => setSelectedStatus(status)}
              flex={1}
            >
              {getStatusLabel(status)}
            </Button>
          ),
        )}
      </Box>

      <VStack spacing={4} align="stretch">
        {getOpportunitiesByStatus(selectedStatus).map((opportunity) => (
          <OpportunityCard
            key={opportunity._id}
            imageUrl={opportunity.images[0]}
            title={opportunity.title}
            createdAt={new Date(opportunity.createdAt)}
            id={opportunity._id}
          />
        ))}
      </VStack>
    </VStack>
  );
};

export default OpportunitiesSection;
