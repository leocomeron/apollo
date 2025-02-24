import 'next-auth';
import { DocumentType } from './onboarding';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    isVerified?: boolean;
    isWorker?: boolean;
    isOnboardingCompleted?: boolean;
    profilePicture?: string | null;
    createdAt?: Date;
    categories?: string[];
    contact?: {
      phone: string;
      location: string;
    } | null;
    birthDate?: string | null;
    documents?: Array<{
      type: DocumentType;
      url: string;
    }>;
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
      profilePicture?: string | null;
      createdAt?: Date;
      categories?: string[];
      contact?: {
        phone: string;
        location: string;
      } | null;
      birthDate?: string | null;
      documents?: Array<{
        type: DocumentType;
        url: string;
      }>;
    };
  }
}
