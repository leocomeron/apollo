import CallToAction from '@/components/CallToAction';
import { Box, Text, VStack } from '@chakra-ui/react';

interface ContactDetailsProps {
  phone: string;
  email: string;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ phone, email }) => {
  return (
    <Box>
      <VStack>
        <Text>Datos de contacto</Text>
        <CallToAction
          minW={300}
          onClick={() => (window.location.href = `tel:${phone}`)}
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
