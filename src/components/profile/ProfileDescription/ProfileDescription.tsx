import { Badge, Box, Image, Text, Tooltip, VStack } from '@chakra-ui/react';
import React from 'react';
import Activities from './Activities';
import DescriptionText from './DescriptionText';

interface ProfileDescriptionProps {
  imageUrl: string;
  name: string;
  activities: string[];
  description: string;
  isVerified?: boolean;
}

const ProfileDescription: React.FC<ProfileDescriptionProps> = ({
  imageUrl,
  name,
  activities,
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
      <Activities initialActivities={activities} />

      {/* Descripción con ícono de lápiz */}
      <DescriptionText initialDescription={description} />
    </VStack>
  );
};

export default ProfileDescription;
