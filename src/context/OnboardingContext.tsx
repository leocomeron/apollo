import { OnboardingContextType, OnboardingInfo } from '@/types/onboarding';
import { createContext, ReactNode, useContext, useState } from 'react';

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

interface OnboardingProviderProps {
  children: ReactNode;
}

const onboardingInitialState: OnboardingInfo = {
  userType: '',
  categories: [],
  location: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: '',
  documents: [],
};

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const [step, setStep] = useState<number>(1);
  const [onboardingInfo, setOnboardingInfo] = useState(onboardingInitialState);

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => Math.max(1, prevStep - 1));

  return (
    <OnboardingContext.Provider
      value={{ step, nextStep, prevStep, onboardingInfo, setOnboardingInfo }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error(
      'useOnboarding debe ser usado dentro de un OnboardingProvider',
    );
  }
  return context;
};
