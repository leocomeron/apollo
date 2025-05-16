import CreateOpportunityForm from '@/components/opportunities/CreateOpportunityForm';
import { getCategories } from '@/services/catalogs';
import { Category } from '@/types/onboarding';
import { Box, Center, Grid, GridItem, Spinner, Text } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface CreateOpportunityProps {
  categories: Category[];
}

export const getServerSideProps: GetServerSideProps<
  CreateOpportunityProps
> = async () => {
  const categories = await getCategories();

  return {
    props: {
      categories,
    },
  };
};

const CreateOpportunity = ({ categories }: CreateOpportunityProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      void router.push('/login');
      return;
    }

    if (status === 'authenticated' && !session.user?.isOnboardingCompleted) {
      void router.push('/onboarding');
      return;
    }

    if (status === 'authenticated' && session.user?.isWorker) {
      void router.push('/profile');
      return;
    }
  }, [status, router, session]);

  if (status === 'loading') {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={8}>
        Crear nueva oportunidad
      </Text>

      <Grid templateColumns="1fr 3fr" gap={8}>
        {/* Left column - Form */}
        <GridItem bg="white" rounded="lg" shadow="base">
          <CreateOpportunityForm categories={categories} />
        </GridItem>

        {/* Right column - Preview */}
        <GridItem bg="white" rounded="lg" shadow="base" p={6}>
          {/* Preview content will go here */}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default CreateOpportunity;
