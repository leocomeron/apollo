import ContactDetails from '@/components/profile/ContactDetails/ContactDetails';
import DetailedReview from '@/components/profile/DetailedReview';
import ProfileDescription from '@/components/profile/ProfileDescription';
import ReviewRating from '@/components/profile/ReviewRating';
import WorkPortfolio from '@/components/profile/WorkPortfolio';
import { reviewsMock } from '@/mocks/reviews';
import { DocumentType } from '@/types/onboarding';
import {
  Box,
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
          <ReviewRating reviews={reviewsMock} />
          <ContactDetails
            initialPhoneNumber={user.contact?.phone}
            email={user.email || 'juan-valdez@gmail.com'}
          />
        </VStack>
      </GridItem>
      {/* Right Column - 2/3 of the screen */}
      <GridItem>
        <VStack spacing={5} align="stretch" mt={{ base: 0, lg: 16 }}>
          <WorkPortfolio
            images={[
              {
                url: 'https://img.freepik.com/foto-gratis/primer-plano-hombre-tenencia-copa-vino-parrilla-carne-barbacoa_23-2147841003.jpg?t=st=1727558760~exp=1727562360~hmac=12e2a2b1b1bfbc32f3f9f858a5c16c65c0a1c20133b51188b61ef9d25a14b813&w=1060',
                description:
                  'Esta fue una parrilla realizada en Country Los Aromos',
              },
              {
                url: 'https://img.freepik.com/foto-gratis/lamparas-modernas-decorativas_23-2148164840.jpg?t=st=1727558965~exp=1727562565~hmac=18852620d78723f2d58871a5d9b5c9c1436601cc234034ac76d2ba1950d60b84&w=1800',
                description: '',
              },
              {
                url: 'https://img.freepik.com/fotos-premium/tecnico-fijacion-tuberias_857340-11187.jpg?w=1800',
                description: 'Arreglo de plomeria',
              },
            ]}
          />
          <Divider mt={5} />
          {/* Detailed Reviews */}
          <Text fontSize="xl" mb={1}>
            Opiniones de contrataciones
          </Text>
          {reviewsMock.map((review, index) => (
            <Box key={index}>
              <DetailedReview review={review} />
            </Box>
          ))}
        </VStack>
      </GridItem>
    </Grid>
  );
};

export default Profile;
