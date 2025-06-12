import { DeleteIcon } from '@chakra-ui/icons';
import { IconButton, IconButtonProps } from '@chakra-ui/react';

interface DeleteButtonProps
  extends Omit<IconButtonProps, 'aria-label' | 'icon'> {
  onClick: () => void;
}

const DeleteButton = ({ onClick, ...props }: DeleteButtonProps) => {
  return (
    <IconButton
      aria-label="Eliminar"
      icon={<DeleteIcon />}
      onClick={onClick}
      variant="ghost"
      {...props}
    />
  );
};

export default DeleteButton;
