import StarIcon from '@/components/icons/StarIcon';
import { Avatar, HStack, Image, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { Review } from '../ReviewRating/ReviewRating';
import { timeAgo } from './helpers';

interface DetailedReviewProps {
  review: Review;
}

const DetailedReview: React.FC<DetailedReviewProps> = ({ review }) => {
  if (!review.comment) return null;

  const renderStars = () => {
    const fullStars = Math.floor(review.score);

    return [...Array(5)].map((_, i) => {
      if (i < fullStars) {
        return <StarIcon key={i} filled />;
      } else {
        return <StarIcon key={i} />;
      }
    });
  };

  return (
    <VStack
      align="flex-start"
      spacing={2}
      w="100%"
      p={4}
      borderWidth={1}
      borderRadius={20}
    >
      {/* First section: Avatar, UserName, and Verified Status */}
      <HStack spacing={4} w="100%">
        <Avatar size="md" src={review.userAvatarUrl} />
        <VStack align="flex-start" spacing={0}>
          <Text fontWeight="bold" fontSize="sm">
            {review.userName}
          </Text>
          {review.isVerified && (
            <Text fontSize="sm" color="brand.700">
              Perfil verificado
            </Text>
          )}
        </VStack>
      </HStack>

      {/* Second section: Star Rating and Time Ago */}
      <HStack spacing={2}>
        <HStack spacing={1}>{renderStars()}</HStack>
        <Text fontSize="x-small" color="gray.500">
          {timeAgo(review.date)}
        </Text>
      </HStack>

      {/* Third section: Image (if exists) and Comment */}
      <HStack spacing={4} w="100%">
        {review.imageUrl && (
          <Image
            src={review.imageUrl}
            alt="Review Image"
            boxSize="100px"
            objectFit="cover"
            borderRadius="md"
          />
        )}
        <Text fontSize="sm">{review.comment}</Text>
      </HStack>
    </VStack>
  );
};

export default DetailedReview;
