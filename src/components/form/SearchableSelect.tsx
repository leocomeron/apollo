import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label?: string;
  labelProps?: {
    fontSize?: string;
    mb?: number;
  };
  placeholder?: string;
  multiple?: boolean;
}

export default function SearchableSelect({
  options,
  selectedValues,
  onChange,
  label,
  labelProps,
  placeholder = 'Seleccionar opciones',
  multiple,
}: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelect = useCallback(
    (value: string) => {
      if (multiple) {
        const newValues = selectedValues.includes(value)
          ? selectedValues.filter((v) => v !== value)
          : [...selectedValues, value];
        onChange(newValues);
      } else {
        onChange([value]);
        setIsOpen(false);
      }
    },
    [multiple, onChange, selectedValues],
  );

  const getSelectedText = () => {
    if (selectedValues.length === 0) return placeholder;
    const selectedLabels = selectedValues
      .map((value) => options.find((opt) => opt.value === value)?.label)
      .filter(Boolean);
    return selectedLabels.join(', ');
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
      <Menu isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
          onClick={() => setIsOpen(true)}
        >
          <Text isTruncated>{getSelectedText()}</Text>
        </MenuButton>
        <MenuList maxH="400px" overflowY="auto">
          <Stack spacing={2} p={2}>
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                fontSize="sm"
              />
            </InputGroup>
            {filteredOptions.map((option) =>
              multiple ? (
                <Checkbox
                  key={option.value}
                  isChecked={selectedValues.includes(option.value)}
                  onChange={() => handleSelect(option.value)}
                  fontSize="sm"
                >
                  {option.label}
                </Checkbox>
              ) : (
                <MenuItem
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  bg={
                    selectedValues.includes(option.value) ? 'gray.100' : 'white'
                  }
                  _hover={{ bg: 'gray.50' }}
                  fontSize="sm"
                  py={2}
                >
                  {option.label}
                </MenuItem>
              ),
            )}
            {filteredOptions.length === 0 && (
              <Text fontSize="sm" color="gray.500" textAlign="center" py={2}>
                No se encontraron resultados
              </Text>
            )}
          </Stack>
        </MenuList>
      </Menu>
    </FormControl>
  );
}
