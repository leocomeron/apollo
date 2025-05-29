import { OPPORTUNITY_TYPES } from '@/constants';
import { Category } from '@/types/onboarding';
import { OpportunityFormData } from '@/types/opportunities';
import { Box, Image, SimpleGrid, Text, VStack } from '@chakra-ui/react';

interface Props {
  formData: OpportunityFormData;
  categories: Category[];
}

export default function CreateOpportunityPreview({
  formData,
  categories,
}: Props) {
  const getOpportunityTypeLabel = (value: string) => {
    return OPPORTUNITY_TYPES.find((type) => type.value === value)?.label || '';
  };

  const getCategoryLabel = (value: string) => {
    return categories.find((cat) => cat.value === value)?.label || '';
  };

  const getCategoriesText = () => {
    const categoryLabels = formData.category
      .map((cat) => getCategoryLabel(cat))
      .filter(Boolean);
    return categoryLabels.join(', ');
  };

  const images: string[] = Array.isArray(formData.images)
    ? formData.images
    : formData.images
      ? [formData.images]
      : [];

  return (
    <VStack spacing={4} align="stretch">
      {formData.title && (
        <Text fontSize="2xl" fontWeight="bold">
          {formData.title}
        </Text>
      )}

      {images.length > 0 && (
        <Box display="flex" gap={4}>
          {/* Main image */}
          <Box flex="1" height="300px">
            <Image
              src={images[0]}
              alt="Preview principal"
              objectFit="cover"
              width="100%"
              height="100%"
              rounded="md"
            />
          </Box>

          {/* Thumbnails */}
          {images.length > 1 && (
            <Box width="200px">
              <SimpleGrid columns={1} spacing={2}>
                {images.slice(1).map((image: string, index: number) => (
                  <Box key={index} height="90px">
                    <Image
                      src={image}
                      alt={`Preview ${index + 2}`}
                      objectFit="cover"
                      width="100%"
                      height="100%"
                      rounded="md"
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </Box>
      )}

      {formData.description && (
        <Text fontSize="md" color="gray.600" whiteSpace="pre-wrap">
          {formData.description}
        </Text>
      )}

      {formData.startDate && (
        <Text>
          <Text as="span" fontWeight="semibold">
            Fecha de inicio:{' '}
          </Text>
          {new Date(formData.startDate).toLocaleDateString('es-AR')}
        </Text>
      )}

      {formData.type && (
        <Text>
          <Text as="span" fontWeight="semibold">
            Tipo:{' '}
          </Text>
          {getOpportunityTypeLabel(formData.type)}
        </Text>
      )}

      {formData.category && formData.category.length > 0 && (
        <Text>
          <Text as="span" fontWeight="semibold">
            Rubros:{' '}
          </Text>
          {getCategoriesText()}
        </Text>
      )}
    </VStack>
  );
}
