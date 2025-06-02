import StarIcon from '@/components/icons/StarIcon';
import { HStack, Progress, Text, VStack } from '@chakra-ui/react';
import React, { useMemo } from 'react';

interface ReviewRatingProps {
  reviewStats: {
    totalReviews: number;
    averageRating: number;
    breakdown: Array<{ score: number; count: number }>;
  };
}

const ReviewRating: React.FC<ReviewRatingProps> = ({ reviewStats }) => {
  const { rating, totalReviews, breakdown } = useMemo(() => {
    return {
      rating: reviewStats.averageRating,
      totalReviews: reviewStats.totalReviews,
      breakdown: reviewStats.breakdown.map((item) => ({
        stars: item.score,
        reviews: item.count,
      })),
    };
  }, [reviewStats]);

  const getProgressValue = (reviews: number) => {
    return totalReviews > 0 ? (reviews / totalReviews) * 100 : 0;
  };

  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    return [...Array(5)].map((_, i) => {
      if (i < fullStars) {
        return <StarIcon key={i} filled />;
      } else if (i === fullStars && hasHalfStar) {
        return <StarIcon key={i} half />;
      } else {
        return <StarIcon key={i} />;
      }
    });
  };

  return (
    <HStack align="flex-start" spacing={8}>
      {/* Left side: rating, stars and total reviews */}
      <VStack align="flex-start" spacing={0} alignItems="center">
        <Text fontSize="xl" lineHeight={1}>
          {rating.toFixed(1)}
        </Text>
        <HStack spacing={0}>{renderStars()}</HStack>
        <Text fontSize="small" color="gray.500" mt={1}>
          ({totalReviews.toLocaleString()})
        </Text>
      </VStack>

      {/* Right side: Progress bars for the breakdown */}
      <VStack align="flex-start" spacing={2} w="100%">
        {breakdown.map((item) => (
          <Progress
            key={item.stars}
            value={getProgressValue(item.reviews)}
            colorScheme="yellow"
            w="100%"
            borderRadius="md"
            size="sm"
          />
        ))}
      </VStack>
    </HStack>
  );
};

export default ReviewRating;
