import ContactDetails from '@/components/profile/ContactDetails/ContactDetails';
import DetailedReviewSection from '@/components/profile/DetailedReviewSection/DetailedReviewSection';
import OpportunitiesSection from '@/components/profile/OpportunitiesSection/OpportunitiesSection';
import ProfileDescription from '@/components/profile/ProfileDescription';
import ReviewRating from '@/components/profile/ReviewRating/ReviewRating';
import WorkPortfolio from '@/components/profile/WorkPortfolio';
import WorkerOpportunitiesSection from '@/components/profile/WorkerOpportunitiesSection';
import { useUserReviews } from '@/hooks/useUserReviews';
import { DocumentType } from '@/types/onboarding';
import {
  Center,
  Divider,
  Grid,
  GridItem,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    reviews,
    reviewStats,
    isLoading: isLoadingReviews,
  } = useUserReviews(session?.user?.id);

  useEffect(() => {
    if (status === 'unauthenticated') {
      void router.push('/login');
      return;
    }

    if (status === 'authenticated' && !session.user?.isOnboardingCompleted) {
      void router.push('/onboarding');
      return;
    }
  }, [status, router, session]);

  const user = session?.user;
  const isWorker = user?.isWorker;

  if (status === 'loading') {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!user) {
    return null;
  }

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
          />
          <ReviewRating reviewStats={reviewStats} />
          <ContactDetails
            initialPhoneNumber={user.contact?.phone}
            email={user.email}
          />
        </VStack>
      </GridItem>
      {/* Right Column - 2/3 of the screen */}
      <GridItem>
        <VStack spacing={5} align="stretch" mt={{ base: 0, lg: 16 }}>
          {isWorker ? (
            <>
              <WorkPortfolio initialJobs={[]} />
              <Divider mt={5} />
              <WorkerOpportunitiesSection />
              <Divider mt={5} />
              <Text fontSize="xl" mb={1}>
                Opiniones de contrataciones
              </Text>
              <DetailedReviewSection
                reviews={reviews}
                isLoading={isLoadingReviews}
              />
            </>
          ) : (
            <OpportunitiesSection />
          )}
        </VStack>
      </GridItem>
    </Grid>
  );
};

export default Profile;
