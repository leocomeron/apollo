import { Box, Grid, GridItem, Input, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import CallToAction from '../../CallToAction/CallToAction';
import OpportunityCard from '../OpportunityCard/OpportunityCard';

interface Opportunity {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: Date;
  status: 'open' | 'in_progress' | 'closed';
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Necesito un albañil para remodelar mi cocina',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    createdAt: new Date('2024-03-15'),
    status: 'open',
  },
  {
    id: '2',
    title: 'Buscando electricista para instalación de aire acondicionado',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    createdAt: new Date('2024-03-10'),
    status: 'in_progress',
  },
  {
    id: '3',
    title: 'Pintor para pintar interior de casa',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    createdAt: new Date('2024-02-28'),
    status: 'closed',
  },
  {
    id: '4',
    title: 'Carpintero para construir muebles a medida',
    imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
    createdAt: new Date('2024-03-20'),
    status: 'open',
  },
];

const OpportunitiesSection: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateOpportunity = async () => {
    setIsRedirecting(true);
    await router.push('/opportunities/create');
    setIsRedirecting(false);
  };

  const filteredOpportunities = mockOpportunities.filter((opportunity) =>
    opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getOpportunitiesByStatus = (status: Opportunity['status']) =>
    filteredOpportunities.filter(
      (opportunity) => opportunity.status === status,
    );

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="2xl" fontWeight="bold">
        Mis Oportunidades
      </Text>

      <Box display="flex" gap={4}>
        <Input
          placeholder="Buscar oportunidades..."
          value={searchTerm}
          onChange={handleSearchChange}
          flex={1}
        />
        <CallToAction
          onClick={handleCreateOpportunity}
          isLoading={isRedirecting}
          loadingText="Cargando..."
        >
          Crear nueva oportunidad
        </CallToAction>
      </Box>

      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem>
          <VStack align="stretch" spacing={4}>
            <Text fontSize="lg" fontWeight="bold">
              Abiertas
            </Text>
            {getOpportunitiesByStatus('open').map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                imageUrl={opportunity.imageUrl}
                title={opportunity.title}
                createdAt={opportunity.createdAt}
              />
            ))}
          </VStack>
        </GridItem>

        <GridItem>
          <VStack align="stretch" spacing={4}>
            <Text fontSize="lg" fontWeight="bold">
              En curso
            </Text>
            {getOpportunitiesByStatus('in_progress').map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                imageUrl={opportunity.imageUrl}
                title={opportunity.title}
                createdAt={opportunity.createdAt}
              />
            ))}
          </VStack>
        </GridItem>

        <GridItem>
          <VStack align="stretch" spacing={4}>
            <Text fontSize="lg" fontWeight="bold">
              Cerradas
            </Text>
            {getOpportunitiesByStatus('closed').map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                imageUrl={opportunity.imageUrl}
                title={opportunity.title}
                createdAt={opportunity.createdAt}
              />
            ))}
          </VStack>
        </GridItem>
      </Grid>
    </VStack>
  );
};

export default OpportunitiesSection;
