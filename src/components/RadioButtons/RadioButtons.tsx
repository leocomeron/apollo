import React, { useState } from 'react';
import { Box, Radio, RadioGroup, Stack } from '@chakra-ui/react';

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
    <RadioGroup onChange={setValue} value={value}>
      <Stack direction="column">
        {options.map((option) => (
          <Box
            key={option.option}
            className="min-w-full max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6 m-1"
          >
            <Radio value={option.option}>{option.label}</Radio>
          </Box>
        ))}
      </Stack>
    </RadioGroup>
  );
};

export default RadioButtons;
