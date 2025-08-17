import DetailedReviewSection from '@/components/profile/DetailedReviewSection/DetailedReviewSection';
import ProfileDescription from '@/components/profile/ProfileDescription';
import ReviewRating from '@/components/profile/ReviewRating/ReviewRating';
import WorkPortfolio from '@/components/profile/WorkPortfolio/WorkPortfolio';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserReviews } from '@/hooks/useUserReviews';
import { DocumentType } from '@/types/onboarding';
import {
  Alert,
  AlertIcon,
  Center,
  Divider,
  Grid,
  GridItem,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const PublicProfile = () => {
  const router = useRouter();
  const { userId } = router.query;

  const {
    user,
    isLoading: isLoadingUser,
    error: userError,
  } = useUserProfile(userId as string);

  const {
    reviews,
    reviewStats,
    isLoading: isLoadingReviews,
  } = useUserReviews(userId as string);

  useEffect(() => {
    if (userError && userError === 'Usuario no encontrado') {
      void router.push('/404');
    }
  }, [userError, router]);

  if (isLoadingUser) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (userError) {
    return (
      <Center h="100vh">
        <Alert status="error" maxW="md">
          <AlertIcon />
          {userError}
        </Alert>
      </Center>
    );
  }

  if (!user) {
    return null;
  }

  const isWorker = user.isWorker;

  return (
    <Grid
      display={{ base: 'block', md: 'grid' }}
      templateColumns={{ base: '1fr', md: '1fr 4fr' }}
      gap={6}
    >
      {/* Left Column - 1/3 of the screen */}
      <GridItem mt={{ base: 0, lg: 10 }}>
        <VStack spacing={5} align="stretch">
          <ProfileDescription
            imageUrl={
              user.documents?.find(
                (document) => document.type === DocumentType.ProfilePicture,
              )?.url || ''
            }
            name={user.firstName + ' ' + user.lastName}
            categories={user.categories}
            description={user.description}
            isVerified={user.isVerified}
            isWorker={isWorker}
            isReadOnly={true}
          />
          <ReviewRating reviewStats={reviewStats} />
        </VStack>
      </GridItem>
      {/* Right Column - 2/3 of the screen */}
      <GridItem>
        <VStack spacing={5} align="stretch" mt={{ base: 0, lg: 16 }}>
          {isWorker ? (
            <>
              <WorkPortfolio userId={userId as string} isReadOnly={true} />
              <Divider mt={5} />
            </>
          ) : (
            <Text fontSize="xl" mb={1}>
              Perfil de empleador
            </Text>
          )}
          <Divider mt={5} />
          <Text fontSize="xl" mb={1}>
            Opiniones
          </Text>
          <DetailedReviewSection
            reviews={reviews}
            isLoading={isLoadingReviews}
          />
        </VStack>
      </GridItem>
    </Grid>
  );
};

export default PublicProfile;
