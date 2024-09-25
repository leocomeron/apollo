import { useOnboarding } from '@/context/OnboardingContext';
import { Circle, HStack } from '@chakra-ui/react';

const TOTAL_STEPS = 4;

const OnboardingStepper = () => {
  const { step } = useOnboarding();

  return (
    <HStack spacing={4} mt={6}>
      {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
        <Circle
          key={index}
          size="12px"
          bg={step >= index + 1 ? 'brand.800' : 'gray.300'}
        />
      ))}
    </HStack>
  );
};

export default OnboardingStepper;
