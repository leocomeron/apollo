import OnboardingFirstStep from '@/components/onboardingSteps/OnboardingFirstStep';
import OnboardingFourthStep from '@/components/onboardingSteps/OnboardingFourthStep';
import OnboardingSecondStep from '@/components/onboardingSteps/OnboardingSecondStep';
import OnboardingStepper from '@/components/onboardingSteps/OnboardingStepper';
import OnboardingThirdStep from '@/components/onboardingSteps/OnboardingThirdStep';
import { categories } from '@/constants';
import { useOnboarding } from '@/context/OnboardingContext';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Link } from '@chakra-ui/next-js';
import { Button, Text, useBreakpointValue, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useSWRMutation from 'swr/mutation';
import { disableNextStepButtonHandler } from '../../utils/helpers';

export default function Onboarding() {
  const router = useRouter();
  const { data: session } = useSession();
  const { step, nextStep, prevStep, onboardingInfo } = useOnboarding();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();

  const { trigger: createUser, isMutating } = useSWRMutation(
    '/api/users',
    async (url) => {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...onboardingInfo,
          userId: session?.user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
      }

      return data;
    },
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <OnboardingFirstStep
            options={[
              { label: 'Quiero trabajar', value: true },
              { label: 'Quiero contratar', value: false },
            ]}
          />
        );
      case 2:
        return <OnboardingSecondStep categoriesCatalog={categories} />;
      case 3:
        return <OnboardingThirdStep />;
      case 4:
        return <OnboardingFourthStep />;
      case 5:
        return (
          <Text fontSize="medium">
            Ya tienes tu perfil creado! Haz click aquí para ir al{' '}
            <Link href="/" color="brand.800" fontWeight="bold">
              Home
            </Link>
          </Text>
        );
      default:
        return null;
    }
  };

  const handleFinishOnboarding = async () => {
    try {
      await createUser();
      toast({
        title: 'Onboarding completado con éxito!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      await router.push('/profile'); // Should take the user to the id of the user created
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error al crear usuario',
        description:
          error instanceof Error
            ? error.message
            : 'Por favor intente nuevamente',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  console.log(onboardingInfo);
  return (
    <>
      <main className="flex flex-col items-center justify-between p-6">
        <div className="flex w-full justify-end">
          <Image
            src="/images/logo-header.png"
            alt="header logo"
            width={isMobile ? 45 : 99}
            height={isMobile ? 60 : 176}
            priority
          />
        </div>
        {step > 1 && (
          <Button
            onClick={prevStep}
            leftIcon={!isMobile ? <ArrowBackIcon /> : undefined}
            bgColor="brand.100"
            _hover={{}}
            position="absolute"
            left="0"
            m={4}
          >
            {isMobile ? '←' : 'Volver'}
          </Button>
        )}

        {renderStep()}
        <Button
          color="white"
          backgroundColor="brand.800"
          className="mt-6 md:w-1/6 w-full"
          _hover={{ bg: 'brand.900' }}
          onClick={async () => {
            if (step === 4) {
              await handleFinishOnboarding();
            }
            nextStep();
          }}
          isDisabled={disableNextStepButtonHandler(step, onboardingInfo)}
          isLoading={isMutating && step === 4}
        >
          {step === 4 ? 'Finalizar' : 'Continuar'}
        </Button>
        <OnboardingStepper />
      </main>
    </>
  );
}
