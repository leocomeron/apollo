import FileDropzone from '@/components/FileDropzone';
import { DocumentType } from '@/types/onboarding';
import { Box, Button, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { useState } from 'react';

const WorkPortfolio = () => {
  // Estado para almacenar las imágenes
  const [images, setImages] = useState<string[]>([]);

  // Ejemplo de función para cargar más imágenes
  const loadMoreImages = () => {
    // Aquí puedes implementar la lógica para cargar más imágenes
    console.log('Load more images');
  };

  return (
    <>
      <Text fontSize="xl">Trabajos realizados</Text>
      <Box maxW={150}>
        <FileDropzone
          text="Añadir trabajos realizados"
          id={DocumentType.WorkPortfolio}
        />
      </Box>

      {/* Sección de imágenes */}
      <Box>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {images.length > 0 ? (
            images
              .slice(0, 3)
              .map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Trabajo realizado ${index + 1}`}
                  borderRadius="md"
                  boxSize="100%"
                  objectFit="cover"
                />
              ))
          ) : (
            <Text fontSize="large" color="gray.500">
              No hay trabajos realizados aún.
            </Text>
          )}
        </SimpleGrid>
        {/* Botón para cargar más imágenes */}
        {images.length > 3 && (
          <Button mt={4} onClick={loadMoreImages}>
            Cargar más
          </Button>
        )}
      </Box>
    </>
  );
};

export default WorkPortfolio;
