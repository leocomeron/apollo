import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  label?: string;
  labelProps?: {
    fontSize?: string;
    mb?: number;
  };
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  placeholder?: string;
}

export default function Select({
  options,
  label,
  labelProps,
  placeholder,
  value,
  onChange,
  name,
}: SelectProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    const event = {
      target: {
        name,
        value: optionValue,
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange(event);
  };

  return (
    <FormControl>
      {label && (
        <FormLabel
          fontSize={labelProps?.fontSize || 'xs'}
          mb={labelProps?.mb || 1}
        >
          {label}
        </FormLabel>
      )}
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          width="100%"
          bg="white"
          border="1px"
          borderColor="gray.200"
          fontWeight="normal"
          textAlign="left"
          color={!value ? 'gray.500' : 'black'}
        >
          <Text isTruncated>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
        </MenuButton>
        <MenuList maxH="300px" overflowY="auto">
          {options.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleSelect(option.value)}
              bg={option.value === value ? 'gray.100' : 'white'}
              _hover={{ bg: 'gray.50' }}
              fontSize="sm"
              py={2}
            >
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </FormControl>
  );
}
