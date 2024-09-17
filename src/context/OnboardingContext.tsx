import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface OnboardingInfo {
  userType: 'hire' | 'work' | '';
}

interface OnboardingContextType {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  onboardingInfo: OnboardingInfo;
  setOnboardingInfo: Dispatch<SetStateAction<OnboardingInfo>>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

interface OnboardingProviderProps {
  children: ReactNode;
}

const onboardingInitialState: OnboardingInfo = {
  userType: '',
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