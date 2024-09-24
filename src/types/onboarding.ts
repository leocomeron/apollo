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
