import { Avatar, Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import ReviewRating from '../profile/ReviewRating/ReviewRating';

interface ProposalCardProps {
  name: string;
  lastName: string;
  profileImage: string;
  budget: number;
  reviewStats: {
    totalReviews: number;
    averageRating: number;
    breakdown: Array<{ score: number; count: number }>;
  };
  onAccept: () => void;
  onReject: () => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  name,
  lastName,
  profileImage,
  budget,
  reviewStats,
  onAccept,
  onReject,
}) => {
  return (
    <Box bg="white" p={2} borderRadius="lg" shadow="sm">
      <HStack spacing={2} align="start">
        <Avatar size="lg" src={profileImage} name={`${name} ${lastName}`} />

        <VStack align="start" flex={1} spacing={1}>
          <Text fontSize="sm" fontWeight="bold">
            {name} {lastName}
          </Text>
          <ReviewRating
            reviewStats={reviewStats}
            hideTotalReviews
            hideProgressBars
            size="xs"
            ratingAverageAlignment="left"
          />
          <Text fontSize="sm" color="brand.900" fontWeight="bold">
            Presupuesto: ${budget.toLocaleString()}
          </Text>
        </VStack>

        <VStack spacing={2} width="full" maxW="80px">
          <Button colorScheme="brand" size="xs" onClick={onAccept} width="full">
            Aceptar
          </Button>
          <Button
            variant="outline"
            colorScheme="red"
            size="xs"
            onClick={onReject}
            width="full"
          >
            Rechazar
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
};

export default ProposalCard;
