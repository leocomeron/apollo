import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import ReviewRating from '../profile/ReviewRating/ReviewRating';

interface ProposalCardProps {
  firstName: string;
  lastName: string;
  profileImage: string;
  budget: number;
  reviewStats: {
    totalReviews: number;
    averageRating: number;
    breakdown: Array<{ score: number; count: number }>;
  };
  status: 'pending' | 'accepted' | 'rejected';
  onAccept: () => void;
  onReject: () => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  firstName,
  lastName,
  profileImage,
  budget,
  reviewStats,
  status,
  onAccept,
  onReject,
}) => {
  const isDisabled = status !== 'pending';

  return (
    <Box bg="white" p={2} borderRadius="lg" shadow="sm" position="relative">
      {status === 'accepted' && (
        <Box
          position="absolute"
          top={0}
          left={0}
          bg="green.500"
          borderRadius="full"
          p={1}
          zIndex={1}
        >
          <Icon as={CheckIcon} color="white" boxSize={4} p={0.5} />
        </Box>
      )}
      {status === 'rejected' && (
        <Box
          position="absolute"
          top={0}
          left={0}
          bg="red.500"
          borderRadius="full"
          p={1}
          zIndex={1}
        >
          <Icon as={CloseIcon} color="white" boxSize={4} p={0.5} />
        </Box>
      )}

      <HStack spacing={2} align="start">
        <Avatar
          size="lg"
          src={profileImage}
          name={`${firstName} ${lastName}`}
        />

        <VStack align="start" flex={1} spacing={1}>
          <Text fontSize="sm" fontWeight="bold">
            {firstName} {lastName}
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
          <Button
            colorScheme="brand"
            size="xs"
            onClick={onAccept}
            width="full"
            isDisabled={isDisabled}
          >
            Aceptar
          </Button>
          <Button
            variant="outline"
            colorScheme="red"
            size="xs"
            onClick={onReject}
            width="full"
            isDisabled={isDisabled}
          >
            Rechazar
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
};

export default ProposalCard;
