import { sanJuanDepartments } from '@/constants';
import { Category, useOnboarding } from '@/context/OnboardingContext';
import {
  Box,
  Heading,
  Select,
  Tag,
  useBreakpointValue,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';

interface OnboardingSecondStepProps {
  categoriesCatalog: Category[];
}

const OnboardingSecondStep: React.FC<OnboardingSecondStepProps> = ({
  categoriesCatalog,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { onboardingInfo, setOnboardingInfo } = useOnboarding();
  const { categories } = onboardingInfo;

  const handleCategoryClick = (value: string) => {
    if (categories.includes(value)) {
      setOnboardingInfo({
        ...onboardingInfo,
        categories: categories.filter(
          (selectedValue) => selectedValue !== value,
        ),
      });
    } else {
      setOnboardingInfo({
        ...onboardingInfo,
        categories: [...categories, value],
      });
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOnboardingInfo({ ...onboardingInfo, location: e.target.value });
  };

  return (
    <>
      <Image
        src="/images/step2-image-long.png"
        alt="Descripción de la imagen"
        width={isMobile ? 240 : 500}
        height={isMobile ? 120 : 300}
        className="mb-8"
      />
      <Box maxWidth="600px" mx="auto">
        <Heading textAlign="center" mb="8">
          ¿A qué rubro te dedicas?
        </Heading>
        <Wrap spacing={4} justify="center">
          {categoriesCatalog.map((category) => (
            <WrapItem key={category.value}>
              <Tag
                size="lg"
                variant="solid"
                bgColor="brand.600"
                cursor="pointer"
                px={{ base: 2, md: 6 }}
                py={{ base: 1, md: 3 }}
                borderRadius="50px"
                borderWidth="3px"
                borderColor={
                  categories.includes(category.value)
                    ? 'brand.900'
                    : 'transparent'
                }
                onClick={() => handleCategoryClick(category.value)}
              >
                {category.label}
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
        <Heading textAlign="center" mb="4" mt="12">
          ¿Dónde te ubicas?
        </Heading>
        <Box maxWidth="400px" mx="auto">
          <Select
            placeholder="Selecciona departamento"
            focusBorderColor="brand.800"
            onChange={handleLocationChange}
            value={onboardingInfo.location}
          >
            {sanJuanDepartments.map((department) => (
              <option value={department} key={department}>
                {department}
              </option>
            ))}
          </Select>
        </Box>
      </Box>
    </>
  );
};

export default OnboardingSecondStep;
