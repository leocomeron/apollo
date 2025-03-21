import { getCategoryLabels } from '@/utils/array';
import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

interface CategoriesProps {
  initialCategories: string[] | undefined;
}

const Categories: React.FC<CategoriesProps> = ({ initialCategories }) => {
  const [categories, setCategories] = useState<string[]>(
    initialCategories || [],
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCategoryChange = (newCategories: string[]) => {
    setCategories(newCategories);
  };

  const saveCategories = () => {
    setCategories(categories);
    onClose();
  };

  const categoriesLabels = getCategoryLabels(categories);

  return (
    <Box position="relative" w="100%" textAlign="center">
      <Box display="flex" justifyContent="center" alignItems="center">
        <Text fontSize="small" fontWeight="bold">
          {categoriesLabels.length > 0
            ? categoriesLabels.join(', ')
            : 'Selecciona tus categorías...'}
        </Text>
        <EditIcon onClick={onOpen} cursor="pointer" ml={2} boxSize={3} />
      </Box>

      {/* Modal para editar las actividades */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent margin={4} alignSelf="center">
          <ModalHeader>Selecciona tus actividades</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CheckboxGroup
              value={categories}
              onChange={(newCategories) =>
                handleCategoryChange(newCategories as string[])
              }
            >
              <VStack align="start">
                {categories.map((category) => (
                  <Checkbox key={category} value={category}>
                    {category}
                  </Checkbox>
                ))}
              </VStack>
            </CheckboxGroup>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={saveCategories}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Categories;
