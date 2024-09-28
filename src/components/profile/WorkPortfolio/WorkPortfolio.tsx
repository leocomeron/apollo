import FileDropzone from '@/components/FileDropzone';
import { DocumentType } from '@/types/onboarding';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Icon,
  Image,
  SimpleGrid,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useState } from 'react';

interface WorkPortfolioProps {
  images: string[];
}

const WorkPortfolio: React.FC<WorkPortfolioProps> = ({ images }) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const loadMoreImages = () => {
    // Aquí puedes implementar la lógica para cargar más imágenes
    console.log('Load more images');
  };

  const toggleTooltip = () => {
    setIsTooltipOpen((prev) => !prev);
  };

  return (
    <>
      <Text fontSize="xl">Trabajos realizados</Text>
      <Box display="flex" alignItems="center">
        <Box>
          <FileDropzone
            text="Añadir trabajos realizados"
            id={DocumentType.WorkPortfolio}
          />
        </Box>
        <Tooltip
          label="Carga fotos o imágenes de tus trabajos para que los clientes puedan verlo"
          isOpen={isTooltipOpen}
          onClose={() => setIsTooltipOpen(false)}
          hasArrow
          placement="top"
        >
          <Icon
            as={InfoOutlineIcon}
            boxSize={4}
            ml={2}
            color="gray.500"
            onClick={toggleTooltip}
            cursor="pointer"
          />
        </Tooltip>
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
                  maxW={350}
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
