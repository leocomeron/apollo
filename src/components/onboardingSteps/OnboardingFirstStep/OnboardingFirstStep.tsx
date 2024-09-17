import RadioButtons from '@/components/RadioButtons';
import { Heading } from '@chakra-ui/react';
import { Options } from '../../RadioButtons/RadioButtons';

interface OnboardingFirstStepProps {
  options: Options[];
}

const OnboardingFirstStep: React.FC<OnboardingFirstStepProps> = ({
  options,
}) => {
  return (
    <>
      <Heading mb="8">Qué te gustaría realizar:</Heading>
      <RadioButtons options={options} />
    </>
  );
};

export default OnboardingFirstStep;
