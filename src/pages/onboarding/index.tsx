import OnboardingFirstStep from '@/components/onboardingSteps/OnboardingFirstStep';
import OnboardingSecondStep from '@/components/onboardingSteps/OnboardingSecondStep';
import OnboardingThirdStep from '@/components/onboardingSteps/OnboardingThirdStep';
import { categories } from '@/constants';
import { useOnboarding } from '@/context/OnboardingContext';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Button, useBreakpointValue } from '@chakra-ui/react';
import { disableNextStepButtonHandler } from '../../utils/helpers';

export default function Onboarding() {
  const { step, nextStep, prevStep, onboardingInfo } = useOnboarding();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <OnboardingFirstStep
            options={[
              { label: 'Quiero trabajar', value: 'work' },
              { label: 'Quiero contratar', value: 'hire' },
            ]}
          />
        );
      case 2:
        return <OnboardingSecondStep categoriesCatalog={categories} />;
      case 3:
        return <OnboardingThirdStep />;
      case 4:
        return <p>STEP 4</p>;
      default:
        return null;
    }
  };

  return (
    <>
      <main className="flex flex-col items-center justify-between p-12">
        {step > 1 && (
          <Button
            onClick={prevStep}
            leftIcon={!isMobile ? <ArrowBackIcon /> : undefined}
            bgColor="brand.100"
            _hover={{}}
            position="absolute"
            left="0"
            m={4}
          >
            {isMobile ? '←' : 'Volver'}
          </Button>
        )}

        {renderStep()}
        <Button
          color="white"
          backgroundColor="brand.800"
          className="mt-6 md:w-1/6 w-full"
          _hover={{ bg: 'brand.900' }}
          onClick={nextStep}
          isDisabled={disableNextStepButtonHandler(step, onboardingInfo)}
        >
          Continuar
        </Button>
      </main>
    </>
  );
}
