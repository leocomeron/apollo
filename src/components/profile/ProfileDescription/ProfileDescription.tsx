import { Badge, Box, Image, Text, Tooltip, VStack } from '@chakra-ui/react';
import React from 'react';
import Categories from './Categories';
import DescriptionText from './DescriptionText';

interface ProfileDescriptionProps {
  imageUrl: string;
  name: string;
  categories: string[] | undefined;
  description: string;
  isVerified?: boolean;
}

const ProfileDescription: React.FC<ProfileDescriptionProps> = ({
  imageUrl,
  name,
  categories,
  description,
  isVerified,
}) => {
  return (
    <VStack align="center" p={5} spacing={0}>
      {/* Foto de perfil */}
      <Box position="relative">
        <Image
          borderRadius="full"
          boxSize="200px" //for mobile we can make it smaller
          src={imageUrl}
          alt={`${name} profile`}
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
      <Categories initialCategories={categories} />

      {/* Descripción con ícono de lápiz */}
      <DescriptionText initialDescription={description} />
    </VStack>
  );
};

export default ProfileDescription;
