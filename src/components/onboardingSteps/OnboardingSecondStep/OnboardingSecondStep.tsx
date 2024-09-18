import { Category } from '@/context/OnboardingContext';
import { Box, Heading, Select, Tag, Wrap, WrapItem } from '@chakra-ui/react';
import React, { useState } from 'react';

interface OnboardingSecondStepProps {
  categories: Category[];
}

const sanJuanDepartments: string[] = [
  'Albardón',
  'Angaco',
  'Calingasta',
  'Capital',
  'Caucete',
  'Chimbas',
  'Iglesia',
  'Jáchal',
  '9 de Julio',
  'Pocito',
  'Rawson',
  'Rivadavia',
  'San Martín',
  'Santa Lucía',
  'Sarmiento',
  'Ullum',
  'Valle Fértil',
  '25 de Mayo',
  'Zonda',
];

const OnboardingSecondStep: React.FC<OnboardingSecondStepProps> = ({
  categories,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleTagClick = (value: string) => {
    if (selectedCategories.includes(value)) {
      setSelectedCategories(
        selectedCategories.filter((selectedValue) => selectedValue !== value),
      );
    } else {
      setSelectedCategories([...selectedCategories, value]);
    }
  };

  return (
    <Box maxWidth="600px" mx="auto">
      <Heading textAlign="center" mb="8">
        ¿A qué rubro te dedicas?
      </Heading>
      <Wrap spacing={4} justify="center">
        {categories.map((category) => (
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
                selectedCategories.includes(category.value)
                  ? 'brand.900'
                  : 'transparent'
              }
              onClick={() => handleTagClick(category.value)}
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
        <Select focusBorderColor="brand.800">
          {sanJuanDepartments.map((department) => (
            <option value={department} key={department}>
              {department}
            </option>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

export default OnboardingSecondStep;
