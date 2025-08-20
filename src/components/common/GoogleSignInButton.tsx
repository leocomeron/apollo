import { Button, ButtonProps } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

interface GoogleSignInButtonProps extends Omit<ButtonProps, 'onClick'> {
  onSignIn?: () => void;
  callbackUrl?: string;
}

const GoogleSignInButton = ({
  onSignIn,
  callbackUrl = '/onboarding',
  ...buttonProps
}: GoogleSignInButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
      onSignIn?.();
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      isLoading={isLoading}
      loadingText="Conectando..."
      width="100%"
      size="lg"
      h={{ base: '45px', md: '52px' }}
      variant="outline"
      bg="white"
      border="1px solid"
      borderColor="gray.300"
      color="gray.700"
      _hover={{
        bg: 'gray.50',
        borderColor: 'gray.400',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
      _active={{
        bg: 'gray.100',
        borderColor: 'gray.500',
      }}
      _focus={{
        boxShadow: '0 0 0 3px rgba(66, 133, 244, 0.1)',
      }}
      {...buttonProps}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        style={{ marginRight: '8px' }}
      >
        <g fill="none" fillRule="evenodd">
          <path
            d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
            fill="#4285F4"
          />
          <path
            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
            fill="#34A853"
          />
          <path
            d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
            fill="#EA4335"
          />
        </g>
      </svg>
      Continuar con Google
    </Button>
  );
};

export default GoogleSignInButton;
