import { Document } from '@/types/onboarding';

export interface Rating {
  average: number;
  total: number;
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
