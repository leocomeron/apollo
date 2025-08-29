import { categories as categoriesCatalog } from '@/constants';
import { getCategoryLabels } from '@/utils/array';
import { EditIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Checkbox,
  CheckboxGroup,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ResponsiveValue,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Property } from 'csstype';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

interface ProfileDescriptionProps {
  imageUrl: string;
  name: string;
  categories: string[] | undefined;
  description: string | undefined;
  isVerified?: boolean;
  isWorker?: boolean;
  isReadOnly?: boolean;
  maxDescriptionLength?: number;
  descriptionJustifyContent?: ResponsiveValue<Property.JustifyContent>;
}

const ProfileDescription: React.FC<ProfileDescriptionProps> = ({
  imageUrl,
  name,
  categories,
  description,
  isVerified,
  isWorker = true,
  isReadOnly = false,
  maxDescriptionLength = 200,
  descriptionJustifyContent = 'center',
}) => {
  const { data: session } = useSession();
  const toast = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categories || [],
  );
  const [currentDescription, setCurrentDescription] = useState<string>(
    description || '',
  );
  const [isDescriptionEditing, setIsDescriptionEditing] =
    useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const categoriesLabels = getCategoryLabels(selectedCategories);

  // Categories mutation
  const { trigger: updateCategories, isMutating: isUpdatingCategories } =
    useSWRMutation('/api/users', async (url) => {
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
    });

  // Description mutation
  const { trigger: updateDescription } = useSWRMutation(
    '/api/users',
    async (url) => {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          description: currentDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update description');
      }

      return data;
    },
  );

  const handleCategoryChange = (newCategories: string[]) => {
    setSelectedCategories(newCategories);
  };

  const handleSaveCategories = async () => {
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

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCurrentDescription(e.target.value);
  };

  const handleSaveDescription = async () => {
    try {
      await updateDescription();
      setIsDescriptionEditing(false);
      toast({
        title: 'Descripción actualizada',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error al actualizar la descripción',
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

  const toggleDescriptionEditing = () => {
    if (isDescriptionEditing) {
      void handleSaveDescription();
    } else {
      setIsDescriptionEditing(true);
    }
  };

  return (
    <VStack align="center" spacing={0}>
      {/* Foto de perfil */}
      <Box position="relative">
        <Image
          borderRadius="full"
          boxSize="200px"
          src={imageUrl}
          alt={`${name} - ${categories?.join(', ')} en Argentina`}
        />
        {/* Badge de verificación */}
        {isVerified && (
          <Tooltip
            label="Perfil Verificado"
            placement="end-end"
            fontSize="x-small"
          >
            <Badge
              position="absolute"
              top="90px"
              right="0px"
              bg="orange.300"
              color="white"
              p={2}
              borderRadius="full"
            >
              <Text width={18} textAlign="center">
                ✔️
              </Text>
            </Badge>
          </Tooltip>
        )}
      </Box>

      {/* Nombre y apellido */}
      <Text fontWeight="bold" fontSize="xl" margin={{ base: 2 }}>
        {name}
      </Text>

      {/* Actividad o actividades */}
      {isWorker && (
        <Box position="relative" w="100%" textAlign="center">
          <Box display="flex" justifyContent="center" alignItems="center">
            <Text fontSize="small" fontWeight="bold">
              {categoriesLabels.length > 0
                ? categoriesLabels.join(', ')
                : isReadOnly
                  ? 'Sin categorías especificadas'
                  : 'Selecciona tus categorías...'}
            </Text>
            {!isReadOnly && (
              <EditIcon
                onClick={onOpen}
                cursor="pointer"
                ml={2}
                color="gray.500"
                _hover={{ color: 'gray.700' }}
                fontSize="medium"
              />
            )}
          </Box>
        </Box>
      )}

      {/* Descripción */}
      {isWorker && (
        <Box w="100%" textAlign="center" display="grid">
          <Box
            display="flex"
            justifyContent={descriptionJustifyContent}
            alignItems="center"
          >
            {isDescriptionEditing ? (
              <Textarea
                value={currentDescription}
                onChange={handleDescriptionChange}
                placeholder="Describe tu experiencia y especialidades..."
                maxLength={maxDescriptionLength}
                size="sm"
                resize="vertical"
                minH="80px"
                maxH="120px"
                w="100%"
                maxW="300px"
              />
            ) : (
              <Text fontSize="small" color="gray.600" maxW="300px">
                {currentDescription ||
                  (isReadOnly
                    ? 'Sin descripción disponible'
                    : 'Agrega una descripción...')}
              </Text>
            )}
            {!isReadOnly && (
              <EditIcon
                onClick={toggleDescriptionEditing}
                cursor="pointer"
                ml={2}
                color="gray.500"
                _hover={{ color: 'gray.700' }}
                fontSize="medium"
              />
            )}
          </Box>
        </Box>
      )}

      {/* Modal para categorías */}
      {!isReadOnly && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Selecciona tus categorías</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <CheckboxGroup
                value={selectedCategories}
                onChange={handleCategoryChange}
              >
                <VStack align="start" spacing={3}>
                  {categoriesCatalog.map((category) => (
                    <Checkbox key={category.value} value={category.value}>
                      {category.label}
                    </Checkbox>
                  ))}
                </VStack>
              </CheckboxGroup>
            </ModalBody>
            <ModalFooter>
              <Box
                as="button"
                onClick={onClose}
                mr={3}
                px={4}
                py={2}
                borderRadius="md"
                border="1px solid"
                borderColor="gray.300"
                _hover={{ bg: 'gray.50' }}
              >
                Cancelar
              </Box>
              <Box
                as="button"
                onClick={handleSaveCategories}
                px={4}
                py={2}
                bg="brand.600"
                color="white"
                borderRadius="md"
                _hover={{ bg: 'brand.700' }}
                opacity={isUpdatingCategories ? 0.6 : 1}
                pointerEvents={isUpdatingCategories ? 'none' : 'auto'}
              >
                {isUpdatingCategories ? 'Guardando...' : 'Guardar'}
              </Box>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </VStack>
  );
};

export default ProfileDescription;
