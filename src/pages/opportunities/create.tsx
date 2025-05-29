import CreateOpportunityForm from '@/components/opportunities/CreateOpportunityForm';
import CreateOpportunityPreview from '@/components/opportunities/CreateOpportunityPreview';
import { getCategories } from '@/services/catalogs';
import { Category } from '@/types/onboarding';
import { OpportunityFormData } from '@/types/opportunities';
import { Box, Center, Grid, GridItem, Spinner, Text } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
  const [formData, setFormData] = useState<OpportunityFormData>({
    image: '',
    title: '',
    category: [],
    description: '',
    department: '',
    type: '',
    startDate: '',
  });

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

      <Grid templateColumns={{ sm: '1fr 4fr' }} gap={8}>
        {/* Left column - Form */}
        <GridItem bg="white" rounded="lg" shadow="base" minW="300px">
          <CreateOpportunityForm
            categories={categories}
            formData={formData}
            onFormChange={setFormData}
          />
        </GridItem>

        {/* Right column - Preview */}
        <GridItem bg="white" rounded="lg" shadow="base" p={6} maxW="900px">
          <CreateOpportunityPreview
            formData={formData}
            categories={categories}
          />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default CreateOpportunity;
