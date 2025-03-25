import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  ResponsiveValue,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { Property } from 'csstype';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

interface DescriptionTextProps {
  initialDescription: string | undefined;
  maxLength?: number;
  justifyContent?: ResponsiveValue<Property.JustifyContent> | undefined;
}

const DescriptionText: React.FC<DescriptionTextProps> = ({
  initialDescription,
  maxLength = 200,
  justifyContent = 'center',
}) => {
  const { data: session } = useSession();
  const toast = useToast();
  const [description, setDescription] = useState<string>(
    initialDescription || '',
  );
  const [isDescriptionEditing, setIsDescriptionEditing] =
    useState<boolean>(false);

  const { trigger: updateDescription, isMutating } = useSWRMutation(
    '/api/users',
    async (url) => {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update description');
      }

      return data;
    },
  );

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setDescription(e.target.value);
  };

  const handleSave = async () => {
    try {
      await updateDescription();
      setIsDescriptionEditing(false);
      toast({
        title: 'Descripción actualizada',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error al actualizar la descripción',
        description:
          error instanceof Error
            ? error.message
            : 'Por favor intente nuevamente',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const toggleEditing = () => {
    if (isDescriptionEditing) {
      void handleSave();
    } else {
      setIsDescriptionEditing(true);
    }
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
            isDisabled={isMutating}
          />
        ) : (
          <div>
            <Text fontSize="sm" textAlign="center">
              {description || 'Descripción sobre vos...'}
            </Text>
          </div>
        )}
        <EditIcon
          onClick={toggleEditing}
          cursor={isMutating ? 'not-allowed' : 'pointer'}
          ml={2}
          boxSize={3}
          aria-label="Editar descripción"
          opacity={isMutating ? 0.5 : 1}
        />
      </Box>
    </Box>
  );
};

export default DescriptionText;
