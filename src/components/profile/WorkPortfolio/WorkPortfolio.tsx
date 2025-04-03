import FileDropzone from '@/components/FileDropzone';
import { CompletedJob } from '@/types/completedJob';
import { DocumentType } from '@/types/onboarding';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import DescriptionText from '../ProfileDescription/DescriptionText';

interface WorkPortfolioProps {
  initialJobs?: CompletedJob[];
  userId?: string;
  isEditable?: boolean;
}

const WorkPortfolio: React.FC<WorkPortfolioProps> = ({
  initialJobs = [],
  userId,
  isEditable = true,
}) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [completedJobs, setCompletedJobs] =
    useState<CompletedJob[]>(initialJobs);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newJobDescription, setNewJobDescription] = useState('');
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  const { data: session } = useSession();
  const toast = useToast();
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const toggleTooltip = () => {
    setIsTooltipOpen((prev) => !prev);
  };

  const fetchCompletedJobs = useCallback(async () => {
    if (!userId && !session?.user?.id) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/completed-jobs?userId=${userId || session?.user?.id}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch completed jobs');
      }

      const data = await response.json();
      setCompletedJobs(data);
    } catch (error) {
      console.error('Error fetching completed jobs:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los trabajos realizados',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, session, toast]);

  useEffect(() => {
    void fetchCompletedJobs();
  }, [userId, session, fetchCompletedJobs]);

  const handleImageUpload = (url: string) => {
    setPendingImageUrl(url);
    setEditingJobId(null);
    setNewJobDescription('');
    onOpen();
  };

  const handleJobSubmit = async () => {
    if (editingJobId) {
      // Actualizar trabajo existente
      await handleUpdateJob(editingJobId, newJobDescription);
    } else {
      // Crear nuevo trabajo
      if (!pendingImageUrl || !session?.user?.id) return;

      try {
        const response = await fetch('/api/completed-jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session.user.id,
            imageUrl: pendingImageUrl,
            description: newJobDescription,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save completed job');
        }

        toast({
          title: 'Éxito',
          description: 'Trabajo realizado guardado correctamente',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error saving completed job:', error);
        toast({
          title: 'Error',
          description: 'No se pudo guardar el trabajo realizado',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }

    setNewJobDescription('');
    setPendingImageUrl(null);
    setEditingJobId(null);
    onClose();
    await fetchCompletedJobs();
  };

  const handleUpdateJob = async (jobId: string, description: string) => {
    try {
      const response = await fetch(`/api/completed-jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job description');
      }

      toast({
        title: 'Éxito',
        description: 'Descripción actualizada correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating job description:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la descripción',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/completed-jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete completed job');
      }

      toast({
        title: 'Éxito',
        description: 'Trabajo realizado eliminado correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      await fetchCompletedJobs();
    } catch (error) {
      console.error('Error deleting completed job:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el trabajo realizado',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFileDropzoneUpload = (url: string) => {
    handleImageUpload(url);
  };

  const handleEditDescription = (job: CompletedJob) => {
    setEditingJobId(job._id?.toString() || null);
    setNewJobDescription(job.description || '');
    setPendingImageUrl(job.imageUrl);
    onOpen();
  };

  return (
    <>
      <Text fontSize="xl">Trabajos realizados</Text>
      {isEditable && (
        <Box display="flex" alignItems="center">
          <Box>
            <FileDropzone
              text="Añadir trabajos realizados"
              documentType={DocumentType.WorkPortfolio}
              onUploadComplete={handleFileDropzoneUpload}
            />
          </Box>
          <Tooltip
            label="Carga fotos o imágenes de tus trabajos para que los clientes puedan verlo"
            isOpen={isTooltipOpen}
            onClose={() => setIsTooltipOpen(false)}
            hasArrow
            placement="top"
          >
            <Icon
              as={InfoOutlineIcon}
              boxSize={4}
              ml={2}
              color="gray.500"
              onClick={toggleTooltip}
              cursor="pointer"
            />
          </Tooltip>
        </Box>
      )}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} mb={5}>
        {!isLoading && completedJobs.length > 0 ? (
          completedJobs.map((job, index) => (
            <Box key={job._id?.toString() || index} position="relative">
              <Image
                src={job.imageUrl}
                alt={`Trabajo realizado ${index + 1}`}
                borderRadius="md"
                boxSize="100%"
                objectFit="cover"
                maxH={350}
                maxW={350}
              />
              {job.description ? (
                <Box
                  onClick={() => isEditable && handleEditDescription(job)}
                  cursor={isEditable ? 'pointer' : 'default'}
                >
                  <DescriptionText
                    initialDescription={job.description}
                    maxLength={90}
                    justifyContent="flex-start"
                  />
                  {isEditable && (
                    <Text fontSize="xs" color="brand.500" mt={1}>
                      (Clic para editar)
                    </Text>
                  )}
                </Box>
              ) : isEditable ? (
                <Button
                  size="xs"
                  mt={2}
                  colorScheme="brand"
                  onClick={() => handleEditDescription(job)}
                >
                  Añadir descripción
                </Button>
              ) : null}
              {isEditable && (
                <Button
                  position="absolute"
                  top="5px"
                  right="5px"
                  size="xs"
                  colorScheme="red"
                  onClick={() =>
                    void handleDeleteJob(job._id?.toString() || '')
                  }
                >
                  Eliminar
                </Button>
              )}
            </Box>
          ))
        ) : (
          <Text fontSize="large" color="gray.500">
            {isLoading
              ? 'Cargando trabajos realizados...'
              : 'No hay trabajos realizados aún.'}
          </Text>
        )}
      </SimpleGrid>

      {/* Modal para agregar o editar descripción */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingJobId ? 'Editar descripción' : 'Añadir descripción'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>
              {editingJobId
                ? 'Edita la descripción de tu trabajo realizado:'
                : 'Añade una descripción para tu trabajo realizado:'}
            </Text>
            <Textarea
              value={newJobDescription}
              onChange={(e) => setNewJobDescription(e.target.value)}
              placeholder="Describe el trabajo realizado"
              size="md"
            />
            {pendingImageUrl && (
              <Flex justifyContent="center" mt={4}>
                <Image
                  src={pendingImageUrl}
                  alt="Vista previa"
                  maxH="200px"
                  borderRadius="md"
                />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="brand" onClick={() => void handleJobSubmit()}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WorkPortfolio;
