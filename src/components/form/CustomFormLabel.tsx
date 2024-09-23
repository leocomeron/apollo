import { FormLabel, FormLabelProps } from '@chakra-ui/react';
import React from 'react';

type CustomFormLabelProps = FormLabelProps;

const CustomFormLabel: React.FC<CustomFormLabelProps> = (props) => {
  return (
    <FormLabel
      fontSize="medium"
      fontWeight="bold"
      mb={1}
      ml={{ base: 2, md: 2 }}
      {...props}
    />
  );
};

export default CustomFormLabel;
