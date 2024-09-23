import { Input, InputProps } from '@chakra-ui/react';
import React from 'react';

type CustomInputProps = InputProps;

const CustomInput: React.FC<CustomInputProps> = (props) => {
  return (
    <Input
      size="lg"
      variant="solid"
      bgColor="brand.600"
      borderColor="brand.900"
      color="white"
      fontWeight="bold"
      px={{ base: 4, md: 6 }}
      py={{ base: 1, md: 3 }}
      borderRadius="50px"
      borderWidth="3px"
      _placeholder={{ color: 'white' }}
      {...props}
    />
  );
};

export default CustomInput;
