import { Heading } from '@chakra-ui/react';
import RadioButtons, { Options } from '../../RadioButtons/RadioButtons';

interface OnboardingFirstStepProps {
  options: Options[];
}

const OnboardingFirstStep: React.FC<OnboardingFirstStepProps> = ({
  options,
}) => {
  return (
    <>
      <Heading textAlign="center" mb="8">
        Qué te gustaría realizar?
      </Heading>
      <RadioButtons options={options} />
    </>
  );
};

export default OnboardingFirstStep;
