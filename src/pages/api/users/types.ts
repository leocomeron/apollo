import { Document } from '@/types/onboarding';

export interface Rating {
  average: number;
  details: { '1': number; '2': number; '3': number; '4': number; '5': number };
}

export interface Contact {
  phone: string;
  email: string;
  location: string;
}
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  categories?: string[];
  description?: string;
  rating?: Rating;
  contact: Contact;
  isVerified: boolean;
  isWorker: boolean;
  isOnboardingCompleted: boolean;
  documents: Document[];
}
