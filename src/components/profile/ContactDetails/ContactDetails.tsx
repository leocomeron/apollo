import CallToAction from '@/components/CallToAction';
import { Box, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';

interface ContactDetailsProps {
  initialPhoneNumber: string;
  email: string;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
  initialPhoneNumber,
  email,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>(initialPhoneNumber);
  console.log(setPhoneNumber);
  return (
    <Box>
      <VStack>
        <Text>Datos de contacto</Text>
        <CallToAction
          minW={300}
          onClick={() => (window.location.href = `tel:${phoneNumber}`)}
        >
          +542465178311
        </CallToAction>
        <CallToAction
          minW={300}
          onClick={() => (window.location.href = `mailto:${email}`)}
        >
          juan-valdez@gmail.com
        </CallToAction>
      </VStack>
    </Box>
  );
};

export default ContactDetails;
