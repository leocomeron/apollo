import { Box, Image, Text, VStack } from '@chakra-ui/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/router';

interface OpportunityCardProps {
  imageUrl: string;
  title: string;
  createdAt: Date;
  id: string;
  applicationsCount?: number;
  ownerFirstName?: string;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  imageUrl,
  title,
  createdAt,
  id,
  applicationsCount = 5,
  ownerFirstName,
}) => {
  const router = useRouter();

  const handleClick = () => {
    void router.push(`/opportunities/${id}`);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      onClick={handleClick}
      _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
      maxW={{ base: 'full', md: '600px' }}
    >
      <Image src={imageUrl} alt={title} h="200px" w="full" objectFit="cover" />
      <VStack p={4} align="stretch">
        <Text
          fontSize="lg"
          fontWeight="bold"
          wordBreak="break-word"
          overflowWrap="break-word"
          maxW="100%"
        >
          {title}
        </Text>
        {ownerFirstName && (
          <Text color="gray.600" fontSize="sm">
            Creado por: {ownerFirstName}
          </Text>
        )}
        <Text color="gray.500">
          {format(createdAt, 'd MMM yyyy', { locale: es })}
        </Text>
        <Text color="gray.500">{applicationsCount} aplicaciones</Text>
      </VStack>
    </Box>
  );
};

export default OpportunityCard;
