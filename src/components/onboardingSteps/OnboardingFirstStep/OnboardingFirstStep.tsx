import { Heading } from '@chakra-ui/react';
import Image from 'next/image';
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
      <Image
        src="/images/step1-image.png"
        alt="Descripción de la imagen"
        width={500}
        height={300}
      />

      <RadioButtons options={options} />
    </>
  );
};

export default OnboardingFirstStep;
