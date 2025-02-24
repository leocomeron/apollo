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
  url?: string;
}

export interface Contact {
  phone: string;
  location: string;
}

export interface OnboardingInfo {
  isWorker: boolean | undefined;
  categories: string[];
  contact: Contact;
  firstName: string;
  lastName: string;
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
