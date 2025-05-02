import { Box, Image, Text, VStack } from '@chakra-ui/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OpportunityCardProps {
  imageUrl: string;
  title: string;
  createdAt: Date;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  imageUrl,
  title,
  createdAt,
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
    >
      <Image
        src={imageUrl}
        alt={title}
        boxSize="80px"
        objectFit="cover"
        borderRadius="md"
      />
      <VStack align="start" spacing={1}>
        <Text fontWeight="bold" noOfLines={2} fontSize="md">
          {title}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {format(createdAt, 'd MMM yyyy', { locale: es })}
        </Text>
      </VStack>
    </Box>
  );
};

export default OpportunityCard;
