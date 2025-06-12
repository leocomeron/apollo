import { EditIcon } from '@chakra-ui/icons';
import { IconButton, IconButtonProps } from '@chakra-ui/react';

interface EditButtonProps extends Omit<IconButtonProps, 'aria-label' | 'icon'> {
  onClick: () => void;
}

const EditButton = ({ onClick, ...props }: EditButtonProps) => {
  return (
    <IconButton
      aria-label="Editar"
      icon={<EditIcon />}
      onClick={onClick}
      variant="ghost"
      {...props}
    />
  );
};

export default EditButton;
