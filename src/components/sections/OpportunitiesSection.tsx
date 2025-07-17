import { Opportunity } from '@/types/opportunities';
import { decodeCategories, decodeOpportunityType } from '@/utils/decoders';
import {
  Box,
  Card,
  CardBody,
  Divider,
  Flex,
  Grid,
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
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Oportunidades Disponibles
      </Text>

      <Stack spacing={4}>
        {opportunities?.map((opportunity) => (
          <Card
            key={opportunity._id}
            variant="outline"
            _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            cursor="pointer"
            transition="all 0.2s"
            onClick={() => handleOpportunityClick(opportunity._id)}
          >
            <CardBody p={{ base: 4, md: 6 }}>
              <Stack spacing={{ base: 3, md: 4 }}>
                <Box>
                  <Text
                    fontSize={{ base: 'lg', md: 'xl' }}
                    fontWeight="bold"
                    mb={2}
                  >
                    {opportunity.title}
                  </Text>
                </Box>

                <Divider />

                <Grid
                  templateColumns={{
                    base: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(4, 1fr)',
                  }}
                  gap={{ base: 3, md: 4 }}
                >
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
                </Grid>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Stack>

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
            Vuelve más tarde para ver nuevas oportunidades.
          </Text>
        </Flex>
      )}
    </Box>
  );
}
