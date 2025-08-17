import UserLink from '@/components/common/UserLink';
import fetcher from '@/lib/fetcher';
import { Proposal } from '@/types/proposal';
import { Box, Image, Text, VStack } from '@chakra-ui/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/router';
import useSWR from 'swr';

interface OpportunityCardProps {
  imageUrl: string;
  title: string;
  createdAt: Date;
  id: string;
  ownerFirstName?: string;
  ownerId?: string;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  imageUrl,
  title,
  createdAt,
  id,

  ownerFirstName,
  ownerId,
}) => {
  const router = useRouter();

  const { data: proposals } = useSWR<Proposal[]>(
    id ? `/api/opportunities/${id}/proposals` : null,
    fetcher,
  );

  const proposalsCount = proposals?.length || 0;

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
        {ownerFirstName && ownerId && (
          <Text color="gray.600" fontSize="sm">
            Creado por: <UserLink userId={ownerId}>{ownerFirstName}</UserLink>
          </Text>
        )}
        {ownerFirstName && !ownerId && (
          <Text color="gray.600" fontSize="sm">
            Creado por: {ownerFirstName}
          </Text>
        )}
        <Text color="gray.500">
          {format(createdAt, 'd MMM yyyy', { locale: es })}
        </Text>
        <Text color="gray.500">
          {proposalsCount} {proposalsCount === 1 ? 'propuesta' : 'propuestas'}
        </Text>
      </VStack>
    </Box>
  );
};

export default OpportunityCard;
