import OpportunityPreview from '@/components/opportunities/OpportunityPreview';
import ProposalCard from '@/components/opportunities/ProposalCard';
import fetcher from '@/lib/fetcher';
import { getCategories } from '@/services/catalogs';
import { Category } from '@/types/onboarding';
import { Box, Container, Grid, GridItem, Text, VStack } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

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
  const handleAcceptProposal = (proposalId: string) => {
    console.log('Accept proposal:', proposalId);
  };

  const handleRejectProposal = (proposalId: string) => {
    console.log('Reject proposal:', proposalId);
  };

  return (
    <Container maxW="container.xl">
      <Grid
        templateColumns={{ base: '1fr', md: '1fr', lg: '2fr 1fr' }}
        gap={{ base: 6, lg: 8 }}
      >
        <GridItem>
          <VStack align="stretch" spacing={4}>
            <OpportunityPreview
              formData={{
                images: opportunity.images,
                title: opportunity.title,
                description: opportunity.description,
                categories: opportunity.categories,
                location: opportunity.location,
                type: opportunity.type,
                startDate: opportunity.startDate,
                status: opportunity.status,
              }}
              categories={categories}
            />
          </VStack>
        </GridItem>

        <GridItem>
          <Box rounded="lg" shadow="base" p={2}>
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
