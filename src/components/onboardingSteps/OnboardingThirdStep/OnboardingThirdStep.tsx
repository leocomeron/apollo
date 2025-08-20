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
  const { firstName, lastName, contact, birthDate } = onboardingInfo;

  // Handlers for input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setOnboardingInfo((prevState) => {
      if (id === 'phone') {
        return {
          ...prevState,
          contact: {
            ...prevState.contact,
            [id]: value,
          },
        };
      }
      return {
        ...prevState,
        [id]: value,
      };
    });
  };

  return (
    <>
      <Image
        src="/images/step3-image.png"
        alt="Descripción de la imagen"
        width={isMobile ? 180 : 350}
        height={isMobile ? 80 : 220}
        className="mb-6"
        priority
      />
      <Box maxWidth="600px" mx="auto">
        <Heading textAlign="center" mb={{ base: 1, md: 6 }}>
          Contanos de vos
        </Heading>

        <Stack spacing={2}>
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
              value={lastName}
              onChange={handleInputChange}
            />
          </FormControl>

          {/* Phone */}
          <FormControl id="phone" isRequired>
            <CustomFormLabel>Teléfono</CustomFormLabel>
            <CustomInput
              type="number"
              value={contact.phone}
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
