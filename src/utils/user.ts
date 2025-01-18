import { User } from '@/pages/api/users/types';
import { DocumentType } from '@/types/onboarding';

export const getProfilePictureUrl = (worker: User): string => {
  return (
    worker.documents.find(
      (document) => document.type === DocumentType.ProfilePicture,
    )?.url || worker.profilePicture
  );
};
