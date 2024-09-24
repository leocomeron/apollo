import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

export interface Category {
  label: string;
  value: string;
}

export enum DocumentType {
  ProfilePicture = 'profilePicture',
  IdentificationFront = 'identificationFront',
  IdentificationBack = 'identificationBack',
  BackgroundVerification = 'backgroundVerification',
}

export interface Document {
  type: DocumentType;
  file: File;
}

export interface OnboardingInfo {
  userType: string;
  categories: string[];
  location: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string; // or Date?
  documents: Document[];
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
