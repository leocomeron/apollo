import { OPPORTUNITY_TYPES, sanJuanDepartments } from '@/constants';
import { Category } from '@/types/onboarding';
import { OpportunityFormData } from '@/types/opportunities';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Input,
  Menu,
  MenuButton,
  MenuList,
  Select,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import DragAndDropImage from '../DragAndDrop/DragAndDropImage';

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

  const handleCategoryToggle = (categoryValue: string) => {
    const newCategories = formData.category.includes(categoryValue)
      ? formData.category.filter((cat) => cat !== categoryValue)
      : [...formData.category, categoryValue];

    onFormChange({
      ...formData,
      category: newCategories,
    });
  };

  const handleImageChange = (imageData: string) => {
    onFormChange({
      ...formData,
      image: imageData,
    });
  };

  const getSelectedCategoriesText = () => {
    if (formData.category.length === 0) return 'Seleccionar rubros';
    const selectedLabels = formData.category
      .map((cat) => categories.find((c) => c.value === cat)?.label)
      .filter(Boolean);
    return selectedLabels.join(', ');
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Image Upload */}
        <FormControl>
          <DragAndDropImage onImageChange={handleImageChange} />
        </FormControl>

        {/* Title */}
        <FormControl>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Título de la oportunidad"
          />
        </FormControl>

        {/* Category */}
        <FormControl>
          <Menu closeOnSelect={false}>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              width="100%"
            >
              <Text isTruncated>{getSelectedCategoriesText()}</Text>
            </MenuButton>
            <MenuList maxH="300px" overflowY="auto">
              <Stack spacing={2} p={2}>
                {categories.map((category) => (
                  <Checkbox
                    key={category.value}
                    isChecked={formData.category.includes(category.value)}
                    onChange={() => handleCategoryToggle(category.value)}
                  >
                    {category.label}
                  </Checkbox>
                ))}
              </Stack>
            </MenuList>
          </Menu>
        </FormControl>

        {/* Description */}
        <FormControl>
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
