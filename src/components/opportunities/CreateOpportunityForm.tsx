import { OPPORTUNITY_TYPES, sanJuanDepartments } from '@/constants';
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
import { useRouter } from 'next/router';
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
      category: selectedCategories,
    });
  };

  const handleImageChange = (imageData: string[]) => {
    onFormChange({
      ...formData,
      images: imageData,
    });
  };

  const handleAddOpportunity = async () => {
    console.log('Oportunidad:', formData);
    await router.push('/profile');
  };

  const isFormValid =
    formData.title &&
    formData.description &&
    formData.department &&
    formData.type &&
    formData.startDate &&
    formData.category.length > 0 &&
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
            selectedValues={formData.category}
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

        {/* Department */}
        <Select
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          options={sanJuanDepartments.map((dept) => ({
            label: dept,
            value: dept,
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
        >
          Publicar oportunidad
        </Button>
      </VStack>
    </Box>
  );
}
