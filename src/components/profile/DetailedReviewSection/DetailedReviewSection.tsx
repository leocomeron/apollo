import { Review } from '@/types/review';
import { Box, Spinner, Text } from '@chakra-ui/react';
import DetailedReview from '../DetailedReview/DetailedReview';
interface DetailedReviewSectionProps {
  reviews: Review[];
  isLoading: boolean;
}

const DetailedReviewSection: React.FC<DetailedReviewSectionProps> = ({
  reviews,
  isLoading,
}) => {
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {reviews.length === 0 ? (
        <Text color="gray.500">Sin opiniones</Text>
      ) : (
        reviews.map((review, index) => (
          <Box key={index} mb={4}>
            <DetailedReview review={review} />
          </Box>
        ))
      )}
    </>
  );
};

export default DetailedReviewSection;
