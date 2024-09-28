import DetailedReview from '@/components/profile/DetailedReview';
import ProfileDescription from '@/components/profile/ProfileDescription';
import ReviewRating from '@/components/profile/ReviewRating';
import WorkPortfolio from '@/components/profile/WorkPortfolio';
import { reviewsMock } from '@/mocks/reviews';
import { Box, Divider, Grid, GridItem, Text, VStack } from '@chakra-ui/react';

const Profile = () => {
  return (
    <Grid templateColumns={{ base: '1fr', md: '1fr 2fr' }} gap={6} p={6}>
      {/* Left Column - 1/3 of the screen */}
      {/* Profile Description */}{' '}
      <GridItem mt={{ base: 0, lg: 10 }}>
        <VStack spacing={6} align="stretch">
          <ProfileDescription
            imageUrl="https://img.freepik.com/fotos-premium/trabajador-construccion-casco-amarillo_58409-13665.jpg"
            name="Juan Valdéz"
            activities={['masonry', 'electricity', 'plumbing']}
            description="Especializado en levantamiento de muro"
            isVerified
          />

          <ReviewRating reviews={reviewsMock} />
        </VStack>
      </GridItem>
      {/* Right Column - 2/3 of the screen */}
      <GridItem>
        <VStack spacing={3} align="stretch" mt={{ base: 0, lg: 16 }}>
          <WorkPortfolio
            images={[
              'https://img.freepik.com/foto-gratis/primer-plano-hombre-tenencia-copa-vino-parrilla-carne-barbacoa_23-2147841003.jpg?t=st=1727558760~exp=1727562360~hmac=12e2a2b1b1bfbc32f3f9f858a5c16c65c0a1c20133b51188b61ef9d25a14b813&w=1060',
              'https://img.freepik.com/foto-gratis/lamparas-modernas-decorativas_23-2148164840.jpg?t=st=1727558965~exp=1727562565~hmac=18852620d78723f2d58871a5d9b5c9c1436601cc234034ac76d2ba1950d60b84&w=1800',
              'https://img.freepik.com/fotos-premium/tecnico-fijacion-tuberias_857340-11187.jpg?w=1800',
            ]}
          />
          <Divider />
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
