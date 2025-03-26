import 'next-auth';
import { DocumentType } from './onboarding';

export interface Document {
  type: DocumentType;
  url: string;
}

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    isVerified?: boolean;
    isWorker?: boolean;
    isOnboardingCompleted?: boolean;
    description?: string;
    profilePicture?: string;
    createdAt?: Date;
    categories?: string[];
    contact?: {
      phone: string;
      location: string;
    } | null;
    birthDate?: string | null;
    documents?: Document[];
  }

  interface Session {
    user: User & {
      id: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      isVerified?: boolean;
      isWorker?: boolean;
      isOnboardingCompleted?: boolean;
      description?: string | null;
      profilePicture?: string | null;
      createdAt?: Date;
      categories?: string[];
      contact?: {
        phone: string;
        location: string;
      } | null;
      birthDate?: string | null;
      documents?: Document[];
    };
  }
}
