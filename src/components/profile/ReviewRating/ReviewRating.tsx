import { HStack, Progress, Text, VStack } from '@chakra-ui/react';
import React from 'react';

// SVG Star Icon component
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? '#FFC107' : '#E0E0E0'} // Gold color for filled, grey for empty
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2.5l2.47 5.16L20 8.37l-4 3.89.94 5.46L12 15.94l-4.94 2.78.94-5.46-4-3.89 5.53-.71L12 2.5z" />
  </svg>
);

interface ReviewRatingProps {
  rating: number;
  totalReviews: number;
  breakdown: {
    stars: number;
    reviews: number;
  }[];
}

const ReviewRating: React.FC<ReviewRatingProps> = ({
  rating,
  totalReviews,
  breakdown,
}) => {
  const getProgressValue = (reviews: number) => {
    return (reviews / totalReviews) * 100;
  };

  return (
    <VStack align="flex-start" spacing={4}>
      {/* Main section with the overall rating */}
      <HStack>
        <Text fontSize="3xl" fontWeight="bold">
          {rating.toFixed(1)}
        </Text>
        <HStack spacing={1}>
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled={i < Math.floor(rating)} />
          ))}
        </HStack>
      </HStack>
      <Text fontSize="md" color="gray.500">
        ({totalReviews.toLocaleString()} reviews)
      </Text>

      {/* Breakdown of the rating by stars */}
      {breakdown.map((item) => (
        <HStack key={item.stars} spacing={4} w="100%">
          <Text w="30px" textAlign="right">
            {item.stars} ★
          </Text>
          <Progress
            value={getProgressValue(item.reviews)}
            colorScheme="yellow"
            w="100%"
            borderRadius="md"
            size="sm"
          />
          <Text w="40px" textAlign="right">
            {item.reviews.toLocaleString()}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
};

export default ReviewRating;
