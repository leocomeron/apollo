import StarIcon from '@/components/icons/StarIcon';
import { Review } from '@/types/review';
import { Avatar, HStack, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import { timeAgo } from './helpers';

interface DetailedReviewProps {
  review: Review;
}

const DetailedReview: React.FC<DetailedReviewProps> = ({ review }) => {
  // Skip rendering if no comment
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

  const reviewerInfo = {
    name: `${review.reviewer.firstName} ${review.reviewer.lastName}`,
    avatarUrl: review.reviewer.profilePicture || '',
    isVerified: review.reviewer.isVerified,
  };

  const formattedDate = timeAgo(new Date(review.date).toISOString());

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
        <Avatar size="md" src={reviewerInfo.avatarUrl} />
        <VStack align="flex-start" spacing={0}>
          <Text fontWeight="bold" fontSize="sm">
            {reviewerInfo.name}
          </Text>
          {reviewerInfo.isVerified && (
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
          {formattedDate}
        </Text>
      </HStack>

      {/* Third section: Image (if exists) and Comment */}
      <HStack spacing={4} w="100%">
        {review.imageUrl && (
          <Image
            className="rounded-md"
            src={review.imageUrl}
            alt="Review Image"
            objectFit="cover"
            width={100}
            height={100}
          />
        )}
        <Text fontSize="sm">{review.comment}</Text>
      </HStack>
    </VStack>
  );
};

export default DetailedReview;
