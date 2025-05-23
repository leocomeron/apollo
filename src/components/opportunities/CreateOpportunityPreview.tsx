import { OPPORTUNITY_TYPES } from '@/constants';
import { Category } from '@/types/onboarding';
import { OpportunityFormData } from '@/types/opportunities';
import { Box, Image, Text, VStack } from '@chakra-ui/react';

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
      .filter(Boolean); // Remove any empty labels
    return categoryLabels.join(', ');
  };

  return (
    <VStack spacing={4} align="stretch">
      {formData.title && (
        <Text fontSize="2xl" fontWeight="bold">
          {formData.title}
        </Text>
      )}

      {formData.description && (
        <Text fontSize="md" color="gray.600" whiteSpace="pre-wrap">
          {formData.description}
        </Text>
      )}

      {formData.image && (
        <Box position="relative" width="100%" height="200px">
          <Image
            src={formData.image}
            alt="Preview"
            objectFit="cover"
            width="100%"
            height="100%"
            rounded="md"
          />
        </Box>
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
