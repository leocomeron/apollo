import OnboardingFirstStep from '@/components/onboardingSteps/OnboardingFirstStep';
import OnboardingSecondStep from '@/components/onboardingSteps/OnboardingSecondStep';
import { Button } from '@chakra-ui/react';
import { useState } from 'react';

export default function Onboarding() {
  const [step, setStep] = useState(1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <OnboardingFirstStep
            options={[
              { label: 'Quiero trabajar', option: 'work' },
              { label: 'Quiero contratar', option: 'hire' },
            ]}
          />
        );
      case 2:
        return <OnboardingSecondStep />;
      case 3:
        return <p>STEP 3</p>;
      case 4:
        return <p>STEP 4</p>;
      default:
        return null;
    }
  };

  return (
    <main className="flex flex-col items-center justify-between p-12">
      {renderStep()}
      <Button
        colorScheme="blue"
        color="white"
        className="mt-6"
        onClick={() => setStep((prevState) => prevState + 1)}
      >
        Continuar
      </Button>
    </main>
  );
}