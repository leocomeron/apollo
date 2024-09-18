import OnboardingFirstStep from '@/components/onboardingSteps/OnboardingFirstStep';
import OnboardingSecondStep from '@/components/onboardingSteps/OnboardingSecondStep';
import { Category, useOnboarding } from '@/context/OnboardingContext';
import { Button } from '@chakra-ui/react';

const categories: Category[] = [
  { label: 'Albañilería', value: 'masonry' },
  { label: 'Plomería', value: 'plumbing' },
  { label: 'Pintura', value: 'painting' },
  { label: 'Carpintería', value: 'carpentry' },
  { label: 'Herrería', value: 'blacksmithing' },
  { label: 'Electricidad', value: 'electricity' },
  { label: 'Otros', value: 'other' },
];

export default function Onboarding() {
  const { step, nextStep, onboardingInfo } = useOnboarding();

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
        return <OnboardingSecondStep categories={categories} />;
      case 3:
        return <p>STEP 3</p>;
      case 4:
        return <p>STEP 4</p>;
      default:
        return null;
    }
  };

  return (
    <>
      <main className="flex flex-col items-center justify-between p-12">
        {renderStep()}
        <Button
          color="white"
          backgroundColor="brand.800"
          className="mt-6 md:w-1/6 w-full"
          _hover={{ bg: 'brand.900' }}
          onClick={nextStep}
          isDisabled={!onboardingInfo.userType}
        >
          Continuar
        </Button>
      </main>
    </>
  );
}
