import FileDropzone from '@/components/FileDropzone';
import { DocumentType } from '@/types/onboarding';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Icon, Image, SimpleGrid, Text, Tooltip } from '@chakra-ui/react';
import { useState } from 'react';
import DescriptionText from '../ProfileDescription/DescriptionText';

interface WorkPortfolioImage {
  url: string;
  description: string;
}
interface WorkPortfolioProps {
  images: WorkPortfolioImage[];
}

const WorkPortfolio: React.FC<WorkPortfolioProps> = ({ images }) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

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
            documentType={DocumentType.WorkPortfolio}
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
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} mb={5}>
        {images.length > 0 ? (
          images.map((image, index) => (
            <Box key={index}>
              <Image
                src={image.url}
                alt={`Trabajo realizado ${index + 1}`}
                borderRadius="md"
                boxSize="100%"
                objectFit="cover"
                maxH={350}
                maxW={350}
                _placeholder="blur"
              />
              {image.description ? (
                <DescriptionText
                  initialDescription={image.description}
                  maxLength={90}
                  justifyContent="flex-start"
                />
              ) : null}
            </Box>
          ))
        ) : (
          <Text fontSize="large" color="gray.500">
            No hay trabajos realizados aún.
          </Text>
        )}
      </SimpleGrid>
    </>
  );
};

export default WorkPortfolio;
