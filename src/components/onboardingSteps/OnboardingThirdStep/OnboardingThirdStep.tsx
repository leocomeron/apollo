import {
  Box,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';

// interface OnboardingThirdStepProps {}

const OnboardingThirdStep: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  // const { onboardingInfo, setOnboardingInfo } = useOnboarding();

  return (
    <>
      <Image
        src="/images/step3-image.png"
        alt="Descripción de la imagen"
        width={isMobile ? 240 : 500}
        height={isMobile ? 120 : 300}
        className="mb-8"
      />
      <Box maxWidth="600px" mx="auto">
        <Heading textAlign="center" mb="8">
          Contanos de vos
        </Heading>
        <Stack spacing={4}>
          {/* First Name */}
          <FormControl id="firstName" isRequired>
            <Input type="text" placeholder="Nombre" />
          </FormControl>

          {/* Last Name */}
          <FormControl id="lastName" isRequired>
            <Input type="text" placeholder="Apellido" />
          </FormControl>

          {/* Email */}
          <FormControl id="email" isRequired>
            <Input type="email" placeholder="Email" />
          </FormControl>

          {/* Phone */}
          <FormControl id="phone">
            <InputGroup>
              <InputLeftAddon>+54</InputLeftAddon>
              <Input type="tel" placeholder="Teléfono" />
            </InputGroup>
          </FormControl>

          {/* Birth Date */}
          <FormControl id="birthDate">
            <Input type="date" placeholder="Fecha de Nacimiento" />
          </FormControl>
        </Stack>
      </Box>
    </>
  );
};

export default OnboardingThirdStep;
