import { EditIcon } from '@chakra-ui/icons';
import { Box, Text, Textarea } from '@chakra-ui/react';
import { useState } from 'react';

interface DescriptionTextProps {
  initialDescription: string;
}

const DescriptionText: React.FC<DescriptionTextProps> = ({
  initialDescription,
}) => {
  const [description, setDescription] = useState<string>(initialDescription);
  const [isDescriptionEditing, setIsDescriptionEditing] =
    useState<boolean>(false);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setDescription(e.target.value);
  };

  const toggleEditing = () => {
    setIsDescriptionEditing(!isDescriptionEditing);
  };

  return (
    <Box position="relative" w="100%" textAlign="center">
      <Box display="flex" justifyContent="center" alignItems="center">
        {isDescriptionEditing ? (
          <Textarea
            value={description}
            onChange={handleDescriptionChange}
            size="sm"
            placeholder="Agregar una descripción sobre vos. Por ejemplo: Albañil especializado a levantamiento de paredes"
            maxW={300}
          />
        ) : (
          <div>
            <Text fontSize="sm" textAlign="center">
              {description || 'Descripción sobre vos...'}
            </Text>
          </div>
        )}
        {/* Lápiz para editar */}
        <EditIcon onClick={toggleEditing} cursor="pointer" ml={2} boxSize={3} />
      </Box>
    </Box>
  );
};

export default DescriptionText;
