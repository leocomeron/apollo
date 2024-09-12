import OnboardingFirstStep from '@/components/OnboardingFirstStep';
import { Button } from '@chakra-ui/react';
import { useState } from 'react';

export default function Onboarding() {
  const [step, setStep] = useState(1);

  return (
    <main className="flex flex-col items-center justify-between p-12">
      {step === 1 && (
        <OnboardingFirstStep
          options={[
            { label: 'Quiero trabajar', option: 'work' },
            { label: 'Quiero contratar', option: 'hire' },
          ]}
        />
      )}
      {step === 2 && <p>STEP 2</p>}
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
