import { InputLeftAddon, InputLeftAddonProps } from '@chakra-ui/react';
import React from 'react';

type CustomInputLeftAddonProps = InputLeftAddonProps;

const CustomInputLeftAddon: React.FC<CustomInputLeftAddonProps> = (props) => {
  return (
    <InputLeftAddon
      size="lg"
      variant="solid"
      bgColor="brand.600"
      borderColor="brand.900"
      px={{ base: 2, md: 6 }}
      py={{ base: 1, md: 5 }}
      borderRadius="50px"
      borderWidth="3px"
      _placeholder={{ color: 'white' }}
      {...props}
    />
  );
};

export default CustomInputLeftAddon;
