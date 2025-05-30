import { Box, Image, Text, VStack } from '@chakra-ui/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OpportunityCardProps {
  imageUrl: string;
  title: string;
  createdAt: Date;
  applicationsCount?: number;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  imageUrl,
  title,
  createdAt,
  applicationsCount = 5,
}) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      display="flex"
      gap={4}
      alignItems="center"
      _hover={{ shadow: 'md' }}
      transition="all 0.2s"
      h="160px"
      minH="160px"
      maxW="500px"
    >
      <Image
        src={imageUrl}
        alt={title}
        boxSize="120px"
        objectFit="cover"
        borderRadius="md"
        flexShrink={0}
      />
      <VStack align="start" spacing={3} flex={1} minW={0}>
        <Text fontWeight="bold" noOfLines={2} fontSize="lg">
          {title}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {format(createdAt, 'd MMM yyyy', { locale: es })}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {applicationsCount} aplicaciones
        </Text>
      </VStack>
    </Box>
  );
};

export default OpportunityCard;
