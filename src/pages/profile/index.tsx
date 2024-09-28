import DetailedReview from '@/components/profile/DetailedReview';
import ProfileDescription from '@/components/profile/ProfileDescription';
import ReviewRating from '@/components/profile/ReviewRating';
import WorkPortfolio from '@/components/profile/WorkPortfolio';
import { reviewsMock } from '@/mocks/reviews';
import { Box, Grid, GridItem, VStack } from '@chakra-ui/react';

const Profile = () => {
  return (
    <Grid templateColumns={{ base: '1fr', md: '1fr 2fr' }} gap={6} p={6}>
      {/* Left Column - 1/3 of the screen */}
      <GridItem mt={{ base: 0, lg: 36 }}>
        <ReviewRating reviews={reviewsMock} />
      </GridItem>

      {/* Right Column - 2/3 of the screen */}
      <GridItem>
        <VStack spacing={6} align="stretch">
          {/* Profile Description */}
          <ProfileDescription
            imageUrl="https://img.freepik.com/fotos-premium/trabajador-construccion-casco-amarillo_58409-13665.jpg"
            name="Juan Valdéz"
            activities={['masonry', 'electricity', 'plumbing']}
            description="Especializado en levantamiento de muro"
            isVerified
          />
          {/* <Input placeholder="contanos de vos...." /> */}

          <WorkPortfolio />

          {/* Detailed Reviews */}
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
