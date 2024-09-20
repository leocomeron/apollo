import { useOnboarding } from '@/context/OnboardingContext';
import { Stack, Tag } from '@chakra-ui/react';
import React from 'react';

export interface Options {
  label: string;
  value: string;
  required?: boolean;
}

interface UserTypeOptionsProps {
  options: Options[];
}

const UserTypeOptions: React.FC<UserTypeOptionsProps> = ({ options }) => {
  const { setOnboardingInfo, onboardingInfo } = useOnboarding();
  const { userType } = onboardingInfo;

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
          px={{ base: 2, md: 6 }}
          py={{ base: 1, md: 3 }}
          borderWidth="3px"
          borderColor={userType === option.value ? 'brand.900' : 'transparent'}
          onClick={() =>
            setOnboardingInfo({ ...onboardingInfo, userType: option.value })
          }
        >
          {option.label}
        </Tag>
      ))}
    </Stack>
  );
};

export default UserTypeOptions;
