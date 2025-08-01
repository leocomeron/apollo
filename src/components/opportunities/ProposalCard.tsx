import UserLink from '@/components/common/UserLink';
import { Avatar, Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import CheckIconComponent from '../common/CheckIcon';
import CloseIconComponent from '../common/CloseIcon';
import ReviewRating from '../profile/ReviewRating/ReviewRating';

interface ProposalCardProps {
  userId: string;
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
  userId,
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
      {status === 'accepted' && <CheckIconComponent />}
      {status === 'rejected' && <CloseIconComponent />}

      <HStack spacing={2} align="start">
        <UserLink userId={userId}>
          <Avatar
            size="lg"
            src={profileImage}
            name={`${firstName} ${lastName}`}
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
          />
        </UserLink>

        <VStack align="start" flex={1} spacing={1}>
          <UserLink userId={userId}>
            <Text fontSize="sm" fontWeight="bold">
              {firstName} {lastName}
            </Text>
          </UserLink>
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
