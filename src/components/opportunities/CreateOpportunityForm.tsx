import { sanJuanDepartments } from '@/constants';
import { Category } from '@/types/onboarding';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import DragAndDropImage from '../DragAndDrop/DragAndDropImage';

const OPPORTUNITY_TYPES = [
  { label: 'Rápido / casual', value: 'quick' },
  { label: 'Varios días', value: 'days' },
  { label: 'Varias semanas', value: 'weeks' },
  { label: 'Oferta de trabajo permanente', value: 'permanent' },
];

interface Props {
  categories: Category[];
}

export default function CreateOpportunityForm({ categories }: Props) {
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    category: '',
    description: '',
    department: '',
    type: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (imageData: string) => {
    setFormData((prev) => ({
      ...prev,
      image: imageData,
    }));
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Image Upload */}
        <FormControl>
          <FormLabel>Imagen</FormLabel>
          <DragAndDropImage onImageChange={handleImageChange} />
        </FormControl>

        {/* Title */}
        <FormControl>
          <FormLabel>Título</FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Ingrese el título de la oportunidad"
          />
        </FormControl>

        {/* Category */}
        <FormControl>
          <FormLabel>Rubro</FormLabel>
          <Select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Seleccionar rubro"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Select>
        </FormControl>

        {/* Description */}
        <FormControl>
          <FormLabel>Descripción</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Describa los detalles de la oportunidad"
          />
        </FormControl>

        {/* Department */}
        <FormControl>
          <FormLabel>Departamento</FormLabel>
          <Select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            placeholder="Seleccionar departamento"
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
          <FormLabel>Tipo de oportunidad</FormLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            placeholder="Seleccionar tipo"
          >
            {OPPORTUNITY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </FormControl>
      </VStack>
    </Box>
  );
}
