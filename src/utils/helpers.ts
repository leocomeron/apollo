import { DocumentType, OnboardingInfo } from '@/types/onboarding';

export const disableNextStepButtonHandler = (
  currentStep: number,
  onboardingInfo: OnboardingInfo,
): boolean => {
  const {
    userType,
    categories,
    location,
    firstName,
    lastName,
    email,
    phone,
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
      return !userType;
    case 2:
      return !categories.length || !location;
    case 3:
      return !firstName || !lastName || !email || !phone || !birthDate;
    case 4:
      return disableDocumentsStep;
    default:
      return true;
  }
};
