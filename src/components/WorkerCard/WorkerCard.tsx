import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react';
import StarIcon from '../icons/StarIcon';

export interface WorkerCardProps {
  profilePicture: string;
  rating: number;
  firstName: string;
  lastName: string;
  profession: string;
  description: string;
}

const WorkerCard: React.FC<WorkerCardProps> = ({
  profilePicture,
  rating,
  firstName,
  lastName,
  profession,
  description,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const filled = rating >= index + 1;
      const half = !filled && rating > index && rating < index + 1;
      return <StarIcon key={index} filled={filled} half={half} size={30} />;
    });
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      maxW="sm"
      boxShadow="md"
      p={4}
    >
      <Image
        src={profilePicture}
        alt={`${firstName} ${lastName}`}
        borderRadius="lg"
        objectFit="cover"
        width="100%"
        height="200px"
      />
      <VStack mt={4} spacing={2} align="start">
        <HStack>{renderStars(rating)}</HStack>
        <Text fontSize="sm" fontWeight="bold">
          {firstName} {lastName}
        </Text>
        <Text fontSize="sm">{profession}</Text>
        <Text fontSize="sm" color="gray.500">
          {description}
        </Text>
      </VStack>
    </Box>
  );
};

export default WorkerCard;
