import { OnboardingInfo } from '@/context/OnboardingContext';

export const disableNextStepButtonHandler = (
  currentStep: number,
  onboardingInfo: OnboardingInfo,
): boolean => {
  switch (currentStep) {
    case 1:
      return !onboardingInfo.userType;
    case 2:
      return !onboardingInfo.categories.length || !onboardingInfo.location;
    default:
      return true;
  }
};
