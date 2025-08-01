import UserLink from '@/components/common/UserLink';
import { Opportunity } from '@/types/opportunities';
import { decodeCategories, decodeOpportunityType } from '@/utils/decoders';
import {
  Box,
  Card,
  CardBody,
  Flex,
  Stack,
  Tag,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface OpportunitiesSectionProps {
  opportunities: Opportunity[];
}

export default function OpportunitiesSection({
  opportunities,
}: OpportunitiesSectionProps) {
  const router = useRouter();

  const handleOpportunityClick = (opportunityId: string) => {
    void router.push(`/opportunities/${opportunityId}`);
  };

  return (
    <Stack spacing={4}>
      {opportunities?.map((opportunity) => (
        <Card
          key={opportunity._id}
          cursor="pointer"
          onClick={() => handleOpportunityClick(opportunity._id)}
          _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
        >
          <CardBody>
            <Stack spacing={4}>
              <Box>
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  {opportunity.title}
                </Text>
                <Text color="gray.600" noOfLines={3}>
                  {opportunity.description}
                </Text>
              </Box>

              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing={{ base: 3, md: 4 }}
                gap={{ base: 3, md: 4 }}
              >
                <Box>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    mb={1}
                    fontWeight="medium"
                  >
                    👤 CREADOR
                  </Text>
                  <Text fontWeight="medium" fontSize="sm">
                    {opportunity.ownerFirstName && opportunity.userId ? (
                      <UserLink userId={opportunity.userId}>
                        {opportunity.ownerFirstName}
                      </UserLink>
                    ) : (
                      opportunity.ownerFirstName || 'Sin nombre'
                    )}
                  </Text>
                </Box>

                <Box>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    mb={1}
                    fontWeight="medium"
                  >
                    📅 FECHA TENTATIVA DE INICIO
                  </Text>
                  <Text fontWeight="medium" fontSize="sm">
                    {new Date(opportunity.startDate).toLocaleDateString(
                      'es-ES',
                    )}
                  </Text>
                </Box>

                <Box>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    mb={1}
                    fontWeight="medium"
                  >
                    📍 UBICACIÓN
                  </Text>
                  <Text fontWeight="medium" fontSize="sm">
                    {opportunity.location}
                  </Text>
                </Box>

                <Box>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    mb={1}
                    fontWeight="medium"
                  >
                    💼 TIPO
                  </Text>
                  <Text fontWeight="medium" fontSize="sm">
                    {decodeOpportunityType(opportunity.type)}
                  </Text>
                </Box>

                <Box>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    mb={1}
                    fontWeight="medium"
                  >
                    🏷️ CATEGORÍAS
                  </Text>
                  <Wrap spacing={1}>
                    {decodeCategories(opportunity.categories).map(
                      (category, index) => (
                        <WrapItem key={index}>
                          <Tag size="sm" colorScheme="blue" fontSize="xs">
                            {category}
                          </Tag>
                        </WrapItem>
                      ),
                    )}
                  </Wrap>
                </Box>
              </Stack>
            </Stack>
          </CardBody>
        </Card>
      ))}

      {(!opportunities || opportunities.length === 0) && (
        <Flex
          direction="column"
          align="center"
          justify="center"
          py={12}
          textAlign="center"
        >
          <Text fontSize="lg" color="gray.500" mb={2}>
            No hay oportunidades disponibles en este momento.
          </Text>
          <Text fontSize="sm" color="gray.400">
            Intenta más tarde o crea una nueva oportunidad.
          </Text>
        </Flex>
      )}
    </Stack>
  );
}
