import { EditIcon } from '@chakra-ui/icons';
import { Box, ResponsiveValue, Text, Textarea } from '@chakra-ui/react';
import { Property } from 'csstype';
import { useState } from 'react';

interface DescriptionTextProps {
  initialDescription: string;
  maxLength?: number;
  justifyContent?: ResponsiveValue<Property.JustifyContent> | undefined;
}

const DescriptionText: React.FC<DescriptionTextProps> = ({
  initialDescription,
  maxLength = 200,
  justifyContent = 'center',
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
    <Box w="100%" textAlign="center" display="grid">
      <Box display="flex" justifyContent={justifyContent} alignItems="center">
        {isDescriptionEditing ? (
          <Textarea
            value={description}
            onChange={handleDescriptionChange}
            onBlur={toggleEditing}
            size="sm"
            placeholder="Agregar una descripción sobre vos. Por ejemplo: Albañil especializado a levantamiento de paredes"
            maxW={300}
            mt={2}
            maxLength={maxLength}
            autoFocus
          />
        ) : (
          <div>
            <Text fontSize="sm" textAlign="center">
              {description || 'Descripción sobre vos...'}
            </Text>
          </div>
        )}
        {/* Lápiz para editar */}
        <EditIcon
          onClick={toggleEditing}
          cursor="pointer"
          ml={2}
          boxSize={3}
          aria-label="Editar descripción"
        />
      </Box>
    </Box>
  );
};

export default DescriptionText;
