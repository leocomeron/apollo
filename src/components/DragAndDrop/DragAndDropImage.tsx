import { uploadToCloudinary } from '@/services/cloudinary';
import { DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ACCEPTED_IMAGE_TYPES } from './helpers';

interface DragAndDropImageProps {
  onImageChange?: (imageData: string[]) => void;
  maxImages?: number;
  initialImages?: string[];
}

const DragAndDropImage = ({
  onImageChange,
  maxImages,
  initialImages = [],
}: DragAndDropImageProps) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      setIsUploading(true);

      if (maxImages && images.length + acceptedFiles.length > maxImages) {
        setError(`Solo puedes subir hasta ${maxImages} imágenes`);
        setIsUploading(false);
        return;
      }

      try {
        const newImages: string[] = [];
        for (const file of acceptedFiles) {
          const imageUrl = await uploadToCloudinary(file);
          newImages.push(imageUrl);
        }

        if (newImages.length > 0) {
          const updatedImages = [...images, ...newImages];
          setImages(updatedImages);
          onImageChange?.(updatedImages);
        }
      } catch (error) {
        setError('Error al subir las imágenes');
        console.error('Error uploading images:', error);
      } finally {
        setIsUploading(false);
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
    disabled: isUploading,
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
        cursor={isUploading ? 'wait' : 'pointer'}
        _hover={{
          bg: 'gray.50',
          borderColor: 'brand.600',
        }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        onClick={() => {
          if (!isUploading) open();
        }}
        opacity={isUploading ? 0.7 : 1}
      >
        <input {...getInputProps()} />
        {error && (
          <Text color="red.500" fontSize="sm" mb={2}>
            {error}
          </Text>
        )}
        <Text fontSize="sm" color="gray.500">
          {isUploading
            ? 'Subiendo imágenes...'
            : maxImages
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
                isDisabled={isUploading}
              />
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default DragAndDropImage;
