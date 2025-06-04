import { HStack, Progress, Text, VStack } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import StarRating from './StarRating';

interface ReviewRatingProps {
  reviewStats: {
    totalReviews: number;
    averageRating: number;
    breakdown: Array<{ score: number; count: number }>;
  };
  hideTotalReviews?: boolean;
  hideProgressBars?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  ratingAverageAlignment?: 'left' | 'right' | 'center';
}

const ReviewRating: React.FC<ReviewRatingProps> = ({
  reviewStats,
  hideTotalReviews,
  hideProgressBars,
  size = 'md',
  ratingAverageAlignment = 'center',
}) => {
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

  return (
    <HStack align="flex-start" spacing={8}>
      {/* Left side: rating, stars and total reviews */}
      <VStack align="flex-start" spacing={0} alignItems="center">
        <Text
          fontSize={size === 'xs' ? 'sm' : size === 'sm' ? 'md' : 'xl'}
          lineHeight={1}
          textAlign={ratingAverageAlignment}
          w="100%"
        >
          {rating.toFixed(1)}
        </Text>
        <StarRating rating={rating} size={size} />
        {!hideTotalReviews && (
          <Text
            fontSize={size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : 'small'}
            color="gray.500"
            mt={1}
          >
            ({totalReviews.toLocaleString()})
          </Text>
        )}
      </VStack>

      {/* Right side: Progress bars for the breakdown */}
      {!hideProgressBars && (
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
      )}
    </HStack>
  );
};

export default ReviewRating;
