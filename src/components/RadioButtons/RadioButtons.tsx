import { Box, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';

export interface Options {
  label: string;
  value: string;
  required?: boolean;
}

interface RadioButtonsProps {
  options: Options[];
}

const RadioButtons: React.FC<RadioButtonsProps> = ({ options }) => {
  const [value, setValue] = useState('');
  return (
    <RadioGroup onChange={setValue} value={value} width="100%">
      <Stack direction="column">
        {options.map((option) => (
          <Box
            key={option.value}
            className="md:w-1/3 w-full mx-auto shadow-lg overflow-hidden p-6 m-1"
            bg="brand.600"
            textColor="white"
            fontWeight="bold"
            borderColor={value === option.value ? 'brand.800' : 'transparent'}
            borderWidth="3px"
            onClick={() => setValue(option.value)} // make all area selectable
            borderRadius="50px"
          >
            <Radio value={option.value} colorScheme="white" size="lg">
              {option.label}
            </Radio>
          </Box>
        ))}
      </Stack>
    </RadioGroup>
  );
};

export default RadioButtons;
