import { Category } from '@/types/onboarding';
import { OpportunityFormData } from '@/types/opportunities';
import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  HStack,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import UserLink from '../common/UserLink';
import StatusBadge from './StatusBadge';

interface OpportunityPreviewProps {
  formData: OpportunityFormData & { ownerFirstName?: string };
  ownerId?: string;
  categories: Category[];
}

export default function OpportunityPreview({
  formData,
  ownerId,
  categories,
}: OpportunityPreviewProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    onOpen();
  };

  const getOpportunityTypeLabel = (value: string) => {
    const category = categories.find((cat) => cat.value === value);
    return category ? category.label : value;
  };

  const getCategoryLabel = (value: string) => {
    return categories.find((cat) => cat.value === value)?.label || '';
  };

  const getCategoriesText = () => {
    const categoryLabels = formData.categories
      .map((cat) => getCategoryLabel(cat))
      .filter(Boolean);
    return categoryLabels.join(', ');
  };

  const images: string[] = Array.isArray(formData.images)
    ? formData.images
    : formData.images
      ? [formData.images]
      : [];

  return (
    <VStack spacing={4} align="stretch">
      {formData.title && (
        <HStack justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold">
            {formData.title}
          </Text>
          {formData.status && <StatusBadge status={formData.status} />}
        </HStack>
      )}

      {formData.ownerFirstName && (
        <Text>
          <Text as="span" fontWeight="semibold">
            Creado por:{' '}
          </Text>
          <UserLink userId={ownerId || ''}>{formData.ownerFirstName}</UserLink>
        </Text>
      )}

      {images.length > 0 && (
        <Box
          display="flex"
          flexDirection={{ base: 'column', md: 'row' }}
          gap={4}
        >
          {/* Main image */}
          <Box flex="1" height={{ base: '200px', md: '300px' }}>
            <Image
              src={images[0]}
              alt="Preview principal"
              objectFit="cover"
              width="100%"
              height="100%"
              rounded="md"
              cursor="pointer"
              onClick={() => handleImageClick(images[0])}
            />
          </Box>

          {/* Thumbnails */}
          {images.length > 1 && (
            <Box width={{ base: '100%', md: '150px' }}>
              <SimpleGrid columns={{ base: 3, md: 1 }} spacing={2}>
                {images.slice(1).map((image: string, index: number) => (
                  <Box key={index} height={{ base: '80px', md: '70px' }}>
                    <Image
                      src={image}
                      alt={`Preview ${index + 2}`}
                      objectFit="cover"
                      width="100%"
                      height="100%"
                      rounded="md"
                      cursor="pointer"
                      onClick={() => handleImageClick(image)}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay onClick={onClose} />
        <ModalContent bg="transparent" boxShadow="none">
          <Box position="absolute" top={4} left={4} zIndex={1}>
            <IconButton
              aria-label="Cerrar"
              icon={<CloseIcon />}
              size="sm"
              colorScheme="blackAlpha"
              onClick={onClose}
              _hover={{
                bg: 'blackAlpha.700',
              }}
            />
          </Box>
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={0}
            onClick={onClose}
          >
            <Image
              src={selectedImage}
              alt="Preview full size"
              maxH="90vh"
              maxW="90vw"
              objectFit="contain"
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {formData.description && (
        <Text
          fontSize="md"
          color="gray.600"
          whiteSpace="pre-wrap"
          wordBreak="break-word"
          overflowWrap="break-word"
          maxW="100%"
        >
          {formData.description}
        </Text>
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

      {formData.categories?.length > 0 && (
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
