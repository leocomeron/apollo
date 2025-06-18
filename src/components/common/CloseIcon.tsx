import { CloseIcon as ChakraCloseIcon } from '@chakra-ui/icons';
import { Box, Icon } from '@chakra-ui/react';

interface CloseIconProps {
  position?: 'absolute' | 'relative';
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  size?: string;
  zIndex?: number;
}

const CloseIcon: React.FC<CloseIconProps> = ({
  position = 'absolute',
  top = 0,
  left = 0,
  right,
  bottom,
  size = '24px',
  zIndex = 1,
}) => {
  return (
    <Box
      position={position}
      top={top}
      left={left}
      right={right}
      bottom={bottom}
      bg="red.600"
      width={size}
      height={size}
      borderRadius="50%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={zIndex}
    >
      <Icon as={ChakraCloseIcon} color="white" boxSize={3} />
    </Box>
  );
};

export default CloseIcon;
