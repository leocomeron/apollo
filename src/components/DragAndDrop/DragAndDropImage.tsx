import { DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ACCEPTED_IMAGE_TYPES, handleImageFile } from './helpers';

interface DragAndDropImageProps {
  onImageChange?: (imageData: string[]) => void;
  maxImages?: number;
}

const DragAndDropImage = ({
  onImageChange,
  maxImages,
}: DragAndDropImageProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);

      if (maxImages && images.length + acceptedFiles.length > maxImages) {
        setError(`Solo puedes subir hasta ${maxImages} imágenes`);
        return;
      }

      const newImages: string[] = [];
      for (const file of acceptedFiles) {
        const { imageData, error } = await handleImageFile(file);
        if (error) {
          setError(error);
          return;
        }
        if (imageData) {
          newImages.push(imageData);
        }
      }

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onImageChange?.(updatedImages);
      }
    },
    [onImageChange, images, maxImages],
  );

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImageChange?.(newImages);
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: maxImages ? maxImages - images.length : 1,
    noClick: false,
    noKeyboard: false,
  });

  return (
    <Box>
      <Box
        {...getRootProps()}
        border="2px dashed"
        borderColor={isDragActive ? 'gray.600' : 'gray.300'}
        p={4}
        rounded="md"
        textAlign="center"
        cursor="pointer"
        _hover={{
          bg: 'gray.50',
          borderColor: 'brand.600',
        }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        onClick={() => {
          open();
        }}
      >
        <input {...getInputProps()} />
        {error && (
          <Text color="red.500" fontSize="sm" mb={2}>
            {error}
          </Text>
        )}
        <Text fontSize="sm" color="gray.500">
          {maxImages
            ? `Agregar hasta ${maxImages} fotos (la primera es la principal) o arrastra y suelta`
            : 'Agregar foto o arrastra y suelta'}
        </Text>
      </Box>

      {images.length > 0 && (
        <SimpleGrid columns={maxImages ? 4 : 1} spacing={4} mt={4}>
          {images.map((image, index) => (
            <Box key={index} position="relative">
              <Image
                src={image}
                alt={`Imagen ${index + 1}`}
                maxH={maxImages ? '100px' : '200px'}
                width="100%"
                objectFit="cover"
                borderRadius="md"
              />
              <IconButton
                aria-label="Eliminar imagen"
                icon={<DeleteIcon boxSize="12px" />}
                size="xs"
                colorScheme="red"
                variant="ghost"
                position="absolute"
                top={1}
                right={1}
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                _hover={{
                  bg: 'red.100',
                }}
              />
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default DragAndDropImage;
