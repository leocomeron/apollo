import { Box, Image, Text } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ACCEPTED_IMAGE_TYPES, handleImageFile } from './helpers';

interface DragAndDropImageProps {
  onImageChange?: (imageData: string) => void;
}

const DragAndDropImage = ({ onImageChange }: DragAndDropImageProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      if (acceptedFiles && acceptedFiles.length > 0) {
        const { imageData, error } = await handleImageFile(acceptedFiles[0]);

        if (error) {
          setError(error);
          return;
        }

        if (imageData) {
          setImage(imageData);
          onImageChange?.(imageData);
        }
      }
    },
    [onImageChange],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
    noClick: false,
    noKeyboard: false,
  });

  return (
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
      minH="100px"
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
      {image ? (
        <Box position="relative" width="100%" maxW="200px">
          <Image
            src={image}
            alt="Imagen subida"
            maxH="200px"
            width="100%"
            objectFit="contain"
            mx="auto"
            borderRadius="md"
          />
        </Box>
      ) : (
        <Text fontSize="sm" color="gray.500">
          Agregar foto ( la primera es la principal) O arrastra y suelta
        </Text>
      )}
    </Box>
  );
};

export default DragAndDropImage;
