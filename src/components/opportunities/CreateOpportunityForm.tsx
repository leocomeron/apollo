import { OPPORTUNITY_TYPES, sanJuanDepartments } from '@/constants';
import { Category } from '@/types/onboarding';
import { OpportunityFormData } from '@/types/opportunities';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import DragAndDropImage from '../DragAndDrop/DragAndDropImage';
import MultiSelect from '../form/MultiSelect';

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

  const handleImageChange = (imageData: string) => {
    onFormChange({
      ...formData,
      image: imageData,
    });
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Image Upload */}
        <FormControl>
          <FormLabel fontSize="xs" mb={1}>
            Imagen
          </FormLabel>
          <DragAndDropImage onImageChange={handleImageChange} />
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
        <FormControl>
          <FormLabel fontSize="xs" mb={1}>
            Departamento
          </FormLabel>
          <Select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            placeholder="Departamento"
          >
            {sanJuanDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </Select>
        </FormControl>

        {/* Opportunity Type */}
        <FormControl>
          <FormLabel fontSize="xs" mb={1}>
            Tipo de oportunidad
          </FormLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            placeholder="Tipo de oportunidad"
          >
            {OPPORTUNITY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </FormControl>

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
      </VStack>
    </Box>
  );
}
