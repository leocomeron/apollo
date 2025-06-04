import StarIcon from '@/components/icons/StarIcon';
import { HStack } from '@chakra-ui/react';
import React from 'react';

interface StarRatingProps {
  rating: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 'md' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const calculatedSize =
    size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'md' ? 16 : 20;

  return (
    <HStack spacing={0}>
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <StarIcon key={i} filled size={calculatedSize} />;
        } else if (i === fullStars && hasHalfStar) {
          return <StarIcon key={i} half size={calculatedSize} />;
        } else {
          return <StarIcon key={i} size={calculatedSize} />;
        }
      })}
    </HStack>
  );
};

export default StarRating;
