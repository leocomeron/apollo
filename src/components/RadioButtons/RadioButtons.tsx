import { useOnboarding } from '@/context/OnboardingContext';
import { Stack, Tag } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

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
  const { setOnboardingInfo, onboardingInfo } = useOnboarding();

  useEffect(() => {
    setOnboardingInfo({ ...onboardingInfo, userType: value });
  }, [value]);

  return (
    <Stack direction="column">
      {options.map((option) => (
        <Tag
          key={option.value}
          borderRadius="50px"
          size="lg"
          variant="solid"
          bgColor="brand.600"
          cursor="pointer"
          px={6}
          py={4}
          borderWidth="3px"
          borderColor={value === option.value ? 'brand.900' : 'transparent'}
          onClick={() => setValue(option.value)}
        >
          {option.label}
        </Tag>
      ))}
    </Stack>
  );
};

export default RadioButtons;
