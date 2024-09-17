import { Box, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';

export interface Options {
  label: string;
  option: string;
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
            key={option.option}
            className="md:w-1/3 w-full mx-auto shadow-lg rounded-lg overflow-hidden p-6 m-1"
            bg="brand.500"
            textColor="white"
            fontWeight="bold"
          >
            <Radio value={option.option} colorScheme="white" size="lg">
              {option.label}
            </Radio>
          </Box>
        ))}
      </Stack>
    </RadioGroup>
  );
};

export default RadioButtons;
