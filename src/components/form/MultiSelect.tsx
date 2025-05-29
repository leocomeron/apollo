import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = 'Seleccionar opciones',
}: MultiSelectProps) {
  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    onChange(newValues);
  };

  const getSelectedText = () => {
    if (selectedValues.length === 0) return placeholder;
    const selectedLabels = selectedValues
      .map((value) => options.find((opt) => opt.value === value)?.label)
      .filter(Boolean);
    return selectedLabels.join(', ');
  };

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        width="100%"
        bg="white"
        border="1px"
        borderColor="gray.200"
        fontWeight="normal"
        textAlign="left"
        color={selectedValues.length === 0 ? 'gray.500' : 'black'}
      >
        <Text isTruncated>{getSelectedText()}</Text>
      </MenuButton>
      <MenuList maxH="300px" overflowY="auto">
        <Stack spacing={2} p={2}>
          {options.map((option) => (
            <Checkbox
              key={option.value}
              isChecked={selectedValues.includes(option.value)}
              onChange={() => handleToggle(option.value)}
            >
              {option.label}
            </Checkbox>
          ))}
        </Stack>
      </MenuList>
    </Menu>
  );
}
