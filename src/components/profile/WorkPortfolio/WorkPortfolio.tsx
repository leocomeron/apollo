import FileDropzone from '@/components/FileDropzone';
import { CompletedJob } from '@/types/completedJob';
import { DocumentType } from '@/types/onboarding';
import { DeleteIcon, EditIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import {
  AspectRatio,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
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

interface WorkPortfolioProps {
  initialJobs?: CompletedJob[];
  userId?: string;
  isEditable?: boolean;
  isReadOnly?: boolean;
}

const WorkPortfolio: React.FC<WorkPortfolioProps> = ({
  initialJobs = [],
  userId,
  isEditable = true,
  isReadOnly = false,
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
      if (isEditable) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los trabajos realizados',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, session, isEditable, toast]);

  useEffect(() => {
    void fetchCompletedJobs();
  }, [userId, session, fetchCompletedJobs]);

  const handleImageUpload = (url: string) => {
    if (isReadOnly) return;
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
      await handleCreateJob(newJobDescription);
    }
  };

  const handleCreateJob = async (description: string) => {
    if (!pendingImageUrl) return;

    try {
      const response = await fetch('/api/completed-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: pendingImageUrl,
          description,
          userId: userId || session?.user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create completed job');
      }

      const newJob = await response.json();
      setCompletedJobs((prev) => [...prev, newJob]);
      setPendingImageUrl(null);
      setNewJobDescription('');
      onClose();

      toast({
        title: 'Trabajo agregado',
        description: 'El trabajo se agregó exitosamente a tu portafolio',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating completed job:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar el trabajo al portafolio',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateJob = async (jobId: string, description: string) => {
    try {
      const response = await fetch(`/api/completed-jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error('Failed to update completed job');
      }

      setCompletedJobs((prev) =>
        prev.map((job) => (job._id === jobId ? { ...job, description } : job)),
      );
      setEditingJobId(null);
      setNewJobDescription('');
      onClose();

      toast({
        title: 'Trabajo actualizado',
        description: 'La descripción se actualizó exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating completed job:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el trabajo',
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

      setCompletedJobs((prev) => prev.filter((job) => job._id !== jobId));

      toast({
        title: 'Trabajo eliminado',
        description: 'El trabajo se eliminó exitosamente del portafolio',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting completed job:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el trabajo',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFileDropzoneUpload = (url: string) => {
    if (isReadOnly) return;
    handleImageUpload(url);
  };

  const handleEditDescription = (job: CompletedJob) => {
    if (isReadOnly) return;
    setEditingJobId(job._id?.toString() || null);
    setNewJobDescription(job.description || '');
    onOpen();
  };

  if (isLoading) {
    return (
      <Box>
        <Text fontSize="xl" mb={4}>
          Portafolio de Trabajos
        </Text>
        <Text color="gray.500">Cargando trabajos...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl">Portafolio de Trabajos</Text>
        {!isReadOnly && isEditable && (
          <Tooltip
            label="Agrega fotos de trabajos realizados para mostrar tu experiencia"
            isOpen={isTooltipOpen}
            onClose={() => setIsTooltipOpen(false)}
          >
            <Icon
              as={InfoOutlineIcon}
              cursor="pointer"
              onClick={toggleTooltip}
              color="gray.400"
              _hover={{ color: 'gray.600' }}
            />
          </Tooltip>
        )}
      </Flex>

      {!isReadOnly && isEditable && (
        <Box mb={4}>
          <FileDropzone
            onUploadComplete={handleFileDropzoneUpload}
            documentType={DocumentType.WorkPortfolio}
            text="Arrastra una imagen de tu trabajo aquí o haz clic para seleccionar"
          />
        </Box>
      )}

      {completedJobs.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {completedJobs.map((job, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              bg="white"
              position="relative"
            >
              <AspectRatio ratio={16 / 9}>
                <img
                  src={job.imageUrl}
                  alt={job.description || 'Trabajo completado'}
                  style={{ objectFit: 'cover' }}
                />
              </AspectRatio>
              {job.description && (
                <Box p={4}>
                  <Text fontSize="sm" color="gray.600">
                    {job.description}
                  </Text>
                </Box>
              )}
              {!isReadOnly && isEditable && (
                <Flex
                  position="absolute"
                  top={2}
                  right={2}
                  gap={1}
                  opacity={0}
                  _groupHover={{ opacity: 1 }}
                  transition="opacity 0.2s"
                >
                  <IconButton
                    aria-label="Editar descripción"
                    icon={<EditIcon />}
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleEditDescription(job)}
                  />
                  <IconButton
                    aria-label="Eliminar trabajo"
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDeleteJob(job._id?.toString() || '')}
                  />
                </Flex>
              )}
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Text color="gray.500">
          {isReadOnly
            ? 'Este usuario aún no ha agregado trabajos a su portafolio.'
            : 'Aún no has agregado trabajos a tu portafolio. Sube fotos de trabajos realizados para mostrar tu experiencia.'}
        </Text>
      )}

      {/* Modal para agregar/editar trabajo */}
      {!isReadOnly && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {editingJobId
                ? 'Editar descripción'
                : 'Agregar trabajo al portafolio'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {!editingJobId && pendingImageUrl && (
                <Box mb={4}>
                  <Image
                    src={pendingImageUrl}
                    alt="Trabajo a agregar"
                    borderRadius="md"
                    maxH="200px"
                    objectFit="cover"
                    w="100%"
                  />
                </Box>
              )}
              <Textarea
                value={newJobDescription}
                onChange={(e) => setNewJobDescription(e.target.value)}
                placeholder="Describe el trabajo realizado..."
                maxLength={500}
                resize="vertical"
                minH="100px"
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleJobSubmit}
                isDisabled={!newJobDescription.trim()}
              >
                {editingJobId ? 'Actualizar' : 'Agregar'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default WorkPortfolio;
