import ContactDetails from '@/components/profile/ContactDetails/ContactDetails';
import DetailedReviewSection from '@/components/profile/DetailedReviewSection/DetailedReviewSection';
import ProfileDescription from '@/components/profile/ProfileDescription';
import ReviewRating from '@/components/profile/ReviewRating/ReviewRating';
import WorkPortfolio from '@/components/profile/WorkPortfolio';
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
    }
  }, [status, router]);

  const user = session?.user;

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
    <Grid templateColumns={{ base: '1fr', md: '1fr 4fr' }} gap={6} p={6}>
      {/* Left Column - 1/3 of the screen */}
      {/* Profile Description */}
      <GridItem mt={{ base: 0, lg: 10 }}>
        <VStack spacing={5} align="stretch">
          <ProfileDescription
            imageUrl={
              user.documents?.find(
                (document) => document.type === DocumentType.ProfilePicture,
              )?.url ||
              'https://img.freepik.com/fotos-premium/trabajador-construccion-casco-amarillo_58409-13665.jpg'
            }
            name={user.firstName + ' ' + user.lastName}
            categories={user.categories}
            description={user.description}
            isVerified={user.isVerified}
          />
          <ReviewRating reviewStats={reviewStats} />
          <ContactDetails
            initialPhoneNumber={user.contact?.phone}
            email={user.email || 'juan-valdez@gmail.com'}
          />
        </VStack>
      </GridItem>
      {/* Right Column - 2/3 of the screen */}
      <GridItem>
        <VStack spacing={5} align="stretch" mt={{ base: 0, lg: 16 }}>
          <WorkPortfolio initialJobs={[]} />
          <Divider mt={5} />
          {/* Detailed Reviews */}
          <Text fontSize="xl" mb={1}>
            Opiniones de contrataciones
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

export default Profile;
