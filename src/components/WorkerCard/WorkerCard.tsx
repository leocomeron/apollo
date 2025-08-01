import { getProfessionLabel } from '@/utils/strings';
import { Avatar, Box, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MdLocationOn } from 'react-icons/md';
import StarIcon from '../icons/StarIcon';

export interface WorkerCardProps {
  userId: string;
  profilePicture: string;
  rating: number;
  firstName: string;
  lastName: string;
  professions: string[];
  description: string;
  location: string;
}

const WorkerCard: React.FC<WorkerCardProps> = ({
  userId,
  profilePicture,
  rating,
  firstName,
  lastName,
  professions,
  description,
  location,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    void router.push(`/profile/${userId}`);
  };

  const renderStars = (rating: number) => {
    if (!rating) {
      return (
        <Text fontSize="sm" color="gray.500">
          Sin calificación aún
        </Text>
      );
    }

    return Array.from({ length: 5 }, (_, index) => {
      const filled = rating >= index + 1;
      const half = !filled && rating > index && rating < index + 1;
      return <StarIcon key={index} filled={filled} half={half} size={16} />;
    });
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
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      }}
      onClick={handleCardClick}
    >
      {profilePicture ? (
        <Image
          src={profilePicture}
          alt={`${firstName} ${lastName}`}
          borderRadius="lg"
          objectFit="cover"
          width="100%"
          height={{ base: '150px', sm: '200px' }}
        />
      ) : (
        <Box
          width="100%"
          height={{ base: '150px', sm: '200px' }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.100"
          borderRadius="lg"
        >
          <Avatar size="2xl" name={`${firstName} ${lastName}`} bg="blue.500" />
        </Box>
      )}
      <VStack mt={4} spacing={2} align="start">
        <HStack>{renderStars(rating)}</HStack>
        <Text fontSize={{ base: 'md', sm: 'lg' }} fontWeight="bold">
          {firstName} {lastName}
        </Text>
        <Text fontSize={{ base: 'sm', sm: 'md' }}>
          {getProfessionLabel(professions)}
        </Text>
        <Text
          fontSize={{ base: 'xs', sm: 'sm' }}
          color="gray.500"
          wordBreak="break-word"
          overflowWrap="break-word"
          maxW="100%"
        >
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
