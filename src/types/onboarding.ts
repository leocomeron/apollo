import { Dispatch, SetStateAction } from 'react';

export interface Category {
  label: string;
  value: string;
}

export enum DocumentType {
  ProfilePicture = 'profilePicture',
  IdentificationFront = 'identificationFront',
  IdentificationBack = 'identificationBack',
  BackgroundVerification = 'backgroundVerification',
  WorkPortfolio = 'workPortfolio',
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

export interface OnboardingContextType {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  onboardingInfo: OnboardingInfo;
  setOnboardingInfo: Dispatch<SetStateAction<OnboardingInfo>>;
}
