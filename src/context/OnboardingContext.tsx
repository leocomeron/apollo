import { OnboardingContextType, OnboardingInfo } from '@/types/onboarding';
import { useSession } from 'next-auth/react';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

interface OnboardingProviderProps {
  children: ReactNode;
}

const onboardingInitialState: OnboardingInfo = {
  isWorker: undefined,
  categories: [],
  contact: {
    phone: '',
    location: '',
  },
  firstName: '',
  lastName: '',
  birthDate: '',
  documents: [],
};

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const [step, setStep] = useState<number>(1);
  const [onboardingInfo, setOnboardingInfo] = useState(onboardingInitialState);
  const { data: session } = useSession();

  // Initialize onboarding info with user data if available
  useEffect(() => {
    if (session?.user) {
      setOnboardingInfo((prevState) => ({
        ...prevState,
        firstName: session.user.firstName || prevState.firstName,
        lastName: session.user.lastName || prevState.lastName,
        birthDate: session.user.birthDate || prevState.birthDate,
        contact: {
          ...prevState.contact,
          phone: session.user.contact?.phone || prevState.contact.phone,
          location:
            session.user.contact?.location || prevState.contact.location,
        },
      }));
    }
  }, [session]);

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
