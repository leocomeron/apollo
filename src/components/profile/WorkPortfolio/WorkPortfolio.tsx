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
import { useEffect, useState } from 'react';

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

  const fetchCompletedJobs = async () => {
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
  };

  useEffect(() => {
    void fetchCompletedJobs();
  }, [userId, session]);

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
      <Text fontSize="xl" mb={4}>
        Trabajos realizados
      </Text>
      {isEditable && (
        <Box display="flex" alignItems="center" mb={4}>
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

      {isLoading ? (
        <Text fontSize="large" color="gray.500" textAlign="center" py={10}>
          Cargando trabajos realizados...
        </Text>
      ) : completedJobs.length > 0 ? (
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3 }}
          spacing={{ base: 4, md: 6 }}
          mb={5}
        >
          {completedJobs.map((job, index) => (
            <Box
              key={job._id?.toString() || index}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="sm"
              transition="all 0.2s"
              _hover={{ boxShadow: 'md' }}
            >
              <Box position="relative">
                <AspectRatio ratio={1}>
                  <Image
                    src={job.imageUrl}
                    alt={`Trabajo realizado ${index + 1}`}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
                </AspectRatio>

                {isEditable && (
                  <Flex position="absolute" top="8px" right="8px" gap={2}>
                    <IconButton
                      aria-label="Editar descripción"
                      icon={<EditIcon />}
                      size="sm"
                      colorScheme="brand"
                      onClick={() => handleEditDescription(job)}
                      borderRadius="full"
                    />
                    <IconButton
                      aria-label="Eliminar trabajo"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() =>
                        void handleDeleteJob(job._id?.toString() || '')
                      }
                      borderRadius="full"
                    />
                  </Flex>
                )}
              </Box>

              <Box p={3}>
                {job.description ? (
                  <Text fontSize="sm">{job.description}</Text>
                ) : isEditable ? (
                  <Button
                    size="xs"
                    colorScheme="brand"
                    onClick={() => handleEditDescription(job)}
                    width="100%"
                  >
                    Añadir descripción
                  </Button>
                ) : (
                  <Text color="gray.400" fontSize="sm" fontStyle="italic">
                    Sin descripción
                  </Text>
                )}
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Box
          py={10}
          textAlign="center"
          borderWidth="1px"
          borderRadius="lg"
          borderStyle="dashed"
        >
          <Text fontSize="large" color="gray.500">
            No hay trabajos realizados aún.
          </Text>
          {isEditable && (
            <Text fontSize="sm" color="gray.400" mt={2}>
              Añade fotos de tus trabajos para mostrar tu experiencia a los
              clientes
            </Text>
          )}
        </Box>
      )}

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
