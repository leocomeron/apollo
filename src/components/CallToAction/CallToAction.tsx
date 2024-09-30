import { Button, ButtonProps } from '@chakra-ui/react';

interface CallToActionProps extends ButtonProps {
  children: React.ReactNode;
}

const CallToAction: React.FC<CallToActionProps> = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      borderWidth={3}
      borderRadius="50px"
      textAlign="center"
      _hover={{ borderColor: 'brand.600' }}
      cursor="pointer"
      bgColor="brand.600"
      position="relative"
      borderColor="brand.900"
      color="white"
      fontWeight="bold"
      px={{ base: 4, md: 6 }}
      py={{ base: 1, md: 1 }}
    >
      {children}
    </Button>
  );
};

export default CallToAction;
