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
import DragAndDropImage from '../DragAndDrop/DragAndDropImage';
import MultiSelect from '../form/MultiSelect';
import Select from '../form/Select';

interface Props {
  categories: Category[];
  formData: OpportunityFormData;
  onFormChange: (data: OpportunityFormData) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export default function EditOpportunityForm({
  categories,
  formData,
  onFormChange,
  onSave,
  isSaving,
}: Props) {
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
        <FormControl>
          <FormLabel fontSize="xs" mb={1}>
            Imagen
          </FormLabel>
          <DragAndDropImage
            onImageChange={handleImageChange}
            maxImages={5}
            initialImages={formData.images}
          />
        </FormControl>

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

        <Select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          options={OPPORTUNITY_TYPES}
          placeholder="Tipo de oportunidad"
          label="Tipo de oportunidad"
        />

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

        <Button
          colorScheme="orange"
          size="lg"
          onClick={onSave}
          mt={4}
          isDisabled={!isFormValid}
          isLoading={isSaving}
        >
          Guardar cambios
        </Button>
      </VStack>
    </Box>
  );
}
