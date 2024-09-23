import { OnboardingInfo } from '@/context/OnboardingContext';

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
  } = onboardingInfo;
  switch (currentStep) {
    case 1:
      return !userType;
    case 2:
      return !categories.length || !location;
    case 3:
      return !firstName || !lastName || !email || !phone || !birthDate;
    default:
      return true;
  }
};
