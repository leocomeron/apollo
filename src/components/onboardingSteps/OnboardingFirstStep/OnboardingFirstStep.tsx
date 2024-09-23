import { Heading, useBreakpointValue } from '@chakra-ui/react';
import Image from 'next/image';
import UserTypeOptions, { Options } from './UserTypeOptions/UserTypeOptions';

interface OnboardingFirstStepProps {
  options: Options[];
}

const OnboardingFirstStep: React.FC<OnboardingFirstStepProps> = ({
  options,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <>
      <Image
        src="/images/step1-image.png"
        alt="Descripción de la imagen"
        width={isMobile ? 240 : 500}
        height={isMobile ? 120 : 300}
        priority
      />
      <Heading textAlign="center" mb="4" fontSize={{ base: 'xl', md: '4xl' }}>
        Qué te gustaría realizar?
      </Heading>
      <UserTypeOptions options={options} />
    </>
  );
};

export default OnboardingFirstStep;
