import { categories as categoriesCatalog } from '@/constants';
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
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

interface CategoriesProps {
  initialCategories: string[] | undefined;
}

const Categories: React.FC<CategoriesProps> = ({ initialCategories }) => {
  const { data: session } = useSession();
  const toast = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategories || [],
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { trigger: updateCategories, isMutating } = useSWRMutation(
    '/api/users',
    async (url) => {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          categories: selectedCategories,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update categories');
      }

      return data;
    },
  );

  const handleCategoryChange = (newCategories: string[]) => {
    setSelectedCategories(newCategories);
  };

  const handleSave = async () => {
    try {
      await updateCategories();
      onClose();
      toast({
        title: 'Categorías actualizadas',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error al actualizar las categorías',
        description:
          error instanceof Error
            ? error.message
            : 'Por favor intente nuevamente',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const categoriesLabels = getCategoryLabels(selectedCategories);

  return (
    <Box position="relative" w="100%" textAlign="center">
      <Box display="flex" justifyContent="center" alignItems="center">
        <Text fontSize="small" fontWeight="bold">
          {categoriesLabels.length > 0
            ? categoriesLabels.join(', ')
            : 'Selecciona tus categorías...'}
        </Text>
        <EditIcon
          onClick={onOpen}
          cursor={isMutating ? 'not-allowed' : 'pointer'}
          ml={2}
          boxSize={3}
          opacity={isMutating ? 0.5 : 1}
          aria-label="Editar categorías"
        />
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent margin={4} alignSelf="center">
          <ModalHeader>Selecciona tus actividades</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CheckboxGroup
              value={selectedCategories}
              onChange={(newCategories) =>
                handleCategoryChange(newCategories as string[])
              }
            >
              <VStack align="start">
                {categoriesCatalog.map((category) => (
                  <Checkbox key={category.value} value={category.value}>
                    {category.label}
                  </Checkbox>
                ))}
              </VStack>
            </CheckboxGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleSave}
              isLoading={isMutating}
            >
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Categories;
