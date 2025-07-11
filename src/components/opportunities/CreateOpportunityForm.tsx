import { OPPORTUNITY_TYPES, sanJuanLocations } from '@/constants';
import { Category } from '@/types/onboarding';
import { OpportunityFormData } from '@/types/opportunities';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import DragAndDropImage from '../DragAndDrop/DragAndDropImage';
import MultiSelect from '../form/MultiSelect';
import Select from '../form/Select';

interface Props {
  categories: Category[];
  formData: OpportunityFormData;
  onFormChange: (data: OpportunityFormData) => void;
}

export default function CreateOpportunityForm({
  categories,
  formData,
  onFormChange,
}: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    onFormChange({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (selectedCategories: string[]) => {
    onFormChange({
      ...formData,
      categories: selectedCategories,
    });
  };

  const handleImageChange = (imageData: string[]) => {
    onFormChange({
      ...formData,
      images: imageData,
    });
  };

  const handleAddOpportunity = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session?.user?.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear la oportunidad');
      }

      const result = await response.json();

      void router.push(`/opportunities/${result.opportunityId}`);
    } catch (error) {
      console.error('Error al crear la oportunidad:', error);
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.title &&
    formData.description &&
    formData.location &&
    formData.type &&
    formData.startDate &&
    formData.categories.length > 0 &&
    formData.images.length > 0;

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Image Upload */}
        <FormControl>
          <FormLabel fontSize="xs" mb={1}>
            Imagen
          </FormLabel>
          <DragAndDropImage onImageChange={handleImageChange} maxImages={5} />
        </FormControl>

        {/* Title */}
        <FormControl>
          <FormLabel fontSize="xs" mb={1}>
            Título
          </FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Título de la oportunidad"
          />
        </FormControl>

        {/* Category */}
        <FormControl>
          <FormLabel fontSize="xs" mb={1}>
            Rubros
          </FormLabel>
          <MultiSelect
            options={categories}
            selectedValues={formData.categories}
            onChange={handleCategoryChange}
            placeholder="Seleccionar rubros"
          />
        </FormControl>

        {/* Description */}
        <FormControl>
          <FormLabel fontSize="xs" mb={1}>
            Descripción
          </FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Descripción detallada de la oportunidad"
          />
        </FormControl>

        {/* Location */}
        <Select
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          options={sanJuanLocations.map((location) => ({
            label: location,
            value: location,
          }))}
          placeholder="Departamento"
          label="Departamento"
        />

        {/* Opportunity Type */}
        <Select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          options={OPPORTUNITY_TYPES}
          placeholder="Tipo de oportunidad"
          label="Tipo de oportunidad"
        />

        {/* Start Date */}
        <FormControl>
          <FormLabel fontSize="xs" mb={1}>
            Fecha de inicio
          </FormLabel>
          <Input
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            placeholder="Fecha de inicio"
          />
        </FormControl>

        {/* Submit Button */}
        <Button
          colorScheme="orange"
          size="lg"
          onClick={handleAddOpportunity}
          mt={4}
          isDisabled={!isFormValid}
          isLoading={isLoading}
        >
          Publicar oportunidad
        </Button>
      </VStack>
    </Box>
  );
}
