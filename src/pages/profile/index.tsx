import ProfileDescription from '@/components/profile/ProfileDescription';
import ReviewRating from '@/components/profile/ReviewRating';

export default function Profile() {
  return (
    <>
      <ProfileDescription
        imageUrl="https://img.freepik.com/fotos-premium/trabajador-construccion-casco-amarillo_58409-13665.jpg"
        name="Juan Valdéz"
        activities={['Albañilería']}
        description="Especializado en levantamiento de muro"
        isVerified
      />
      <ReviewRating
        rating={2}
        totalReviews={220}
        breakdown={[
          { stars: 5, reviews: 1200 },
          { stars: 4, reviews: 300 },
          { stars: 3, reviews: 150 },
          { stars: 2, reviews: 50 },
          { stars: 1, reviews: 10 },
        ]}
      />
    </>
  );
}
