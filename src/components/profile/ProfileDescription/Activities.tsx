import { categories } from '@/constants';
import { getCategoryLabels } from '@/utils/array';
import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

interface ActivitiesProps {
  initialActivities: string[];
}

const Activities: React.FC<ActivitiesProps> = ({ initialActivities }) => {
  const [activities, setActivities] = useState<string[]>(initialActivities);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleActivityChange = (newActivities: string[]) => {
    setActivities(newActivities);
  };

  const saveActivities = () => {
    setActivities(activities);
    onClose();
  };

  const activitiesLabels = getCategoryLabels(activities);

  return (
    <Box position="relative" w="100%" textAlign="center">
      <Box display="flex" justifyContent="center" alignItems="center">
        <Text fontSize="small" fontWeight="bold">
          {activitiesLabels.length > 0
            ? activitiesLabels.join(', ')
            : 'Selecciona tus actividades...'}
        </Text>
        <EditIcon onClick={onOpen} cursor="pointer" ml={2} boxSize={3} />
      </Box>

      {/* Modal para editar las actividades */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent margin={4} alignSelf="center">
          <ModalHeader>Selecciona tus actividades</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CheckboxGroup
              value={activities}
              onChange={(newActivities) =>
                handleActivityChange(newActivities as string[])
              }
            >
              <VStack align="start">
                {categories.map((category) => (
                  <Checkbox key={category.value} value={category.value}>
                    {category.label}
                  </Checkbox>
                ))}
              </VStack>
            </CheckboxGroup>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={saveActivities}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Activities;
