import CustomFormLabel from '@/components/form/CustomFormLabel';
import CustomInput from '@/components/form/CustomInput';
import { useOnboarding } from '@/context/OnboardingContext';
import {
  Box,
  FormControl,
  FormHelperText,
  Heading,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';

const OnboardingThirdStep: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { onboardingInfo, setOnboardingInfo } = useOnboarding();
  const { firstName, lastName, email, phone, birthDate } = onboardingInfo;

  // Handlers for input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setOnboardingInfo((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <>
      <Image
        src="/images/step3-image.png"
        alt="Descripción de la imagen"
        width={isMobile ? 240 : 500}
        height={isMobile ? 120 : 300}
        className="mb-8"
        priority
      />
      <Box maxWidth="600px" mx="auto">
        <Heading textAlign="center" mb="8">
          Contanos de vos
        </Heading>
        <Stack spacing={4}>
          {/* First Name */}
          <FormControl id="firstName" isRequired>
            <CustomFormLabel>Nombre</CustomFormLabel>
            <CustomInput
              type="text"
              // placeholder="Nombre"
              value={firstName}
              onChange={handleInputChange}
            />
          </FormControl>

          {/* Last Name */}
          <FormControl id="lastName" isRequired>
            <CustomFormLabel>Apellido</CustomFormLabel>
            <CustomInput
              type="text"
              // placeholder="Apellido"
              value={lastName}
              onChange={handleInputChange}
            />
          </FormControl>

          {/* Email */}
          <FormControl id="email" isRequired>
            <CustomFormLabel>Email</CustomFormLabel>
            <CustomInput
              type="email"
              // placeholder="Email"
              value={email}
              onChange={handleInputChange}
            />
          </FormControl>

          {/* Phone */}
          <FormControl id="phone" isRequired>
            <CustomFormLabel>Teléfono</CustomFormLabel>
            <CustomInput
              type="number"
              // placeholder="Teléfono"
              value={phone}
              onChange={handleInputChange}
            />
            <FormHelperText ml={2}>
              Sin 0, sin el 15 y sin espacios. Ej: 2645178311
            </FormHelperText>
          </FormControl>

          {/* Birth Date */}
          <FormControl id="birthDate" isRequired>
            <CustomFormLabel>Fecha de nacimiento</CustomFormLabel>
            <CustomInput
              type="date"
              value={birthDate}
              onChange={handleInputChange}
            />
          </FormControl>
        </Stack>
      </Box>
    </>
  );
};

export default OnboardingThirdStep;
