import { categories } from '@/constants';
import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { MdLocationOn } from 'react-icons/md';
import StarIcon from '../icons/StarIcon';

export interface WorkerCardProps {
  profilePicture: string;
  rating: number;
  firstName: string;
  lastName: string;
  profession: string;
  description: string;
  location: string;
}

const WorkerCard: React.FC<WorkerCardProps> = ({
  profilePicture,
  rating,
  firstName,
  lastName,
  profession,
  description,
  location,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const filled = rating >= index + 1;
      const half = !filled && rating > index && rating < index + 1;
      return <StarIcon key={index} filled={filled} half={half} size={16} />;
    });
  };

  const getProfessionLabel = (profession: string) => {
    const category = categories.find(
      (category) => category.value === profession,
    );
    return category ? category.label : 'Otro';
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      maxW={{ base: '100%', sm: 'sm' }}
      boxShadow="md"
      p={4}
      m={2}
    >
      <Image
        src={profilePicture}
        alt={`${firstName} ${lastName}`}
        borderRadius="lg"
        objectFit="cover"
        width="100%"
        height={{ base: '150px', sm: '200px' }}
      />
      <VStack mt={4} spacing={2} align="start">
        <HStack>{renderStars(rating)}</HStack>
        <Text fontSize={{ base: 'md', sm: 'lg' }} fontWeight="bold">
          {firstName} {lastName}
        </Text>
        <Text fontSize={{ base: 'sm', sm: 'md' }}>
          {getProfessionLabel(profession)}
        </Text>
        <Text fontSize={{ base: 'xs', sm: 'sm' }} color="gray.500">
          {description}
        </Text>
        <HStack>
          <MdLocationOn color="grey" />
          <Text fontSize={{ base: 'xs', sm: 'sm' }} color="gray.500">
            {location}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default WorkerCard;
