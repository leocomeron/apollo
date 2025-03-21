import { DocumentType, OnboardingInfo } from '@/types/onboarding';

export const disableNextStepButtonHandler = (
  currentStep: number,
  onboardingInfo: OnboardingInfo,
): boolean => {
  const {
    isWorker,
    categories,
    contact,
    firstName,
    lastName,
    birthDate,
    documents,
  } = onboardingInfo;

  // Backgorund verification is not mandatory for onboarding
  const mandatoryDocuments = documents.filter(
    (document) =>
      document.type !== DocumentType.BackgroundVerification && document.file,
  );
  const disableDocumentsStep = mandatoryDocuments.length !== 3;

  switch (currentStep) {
    case 1:
      return isWorker === undefined;
    case 2:
      return !categories.length || !contact.location;
    case 3:
      return !firstName || !lastName || !contact.phone || !birthDate;
    case 4:
      return disableDocumentsStep;
    default:
      return true;
  }
};
