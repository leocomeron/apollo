import DragAndDropImage from '@/components/DragAndDrop/DragAndDropImage';
import { updateOpportunity } from '@/services/opportunities';
import { OpportunityFormData } from '@/types/opportunities';
import { StarIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

interface AcceptedProposal {
  id: string;
  workerId: string;
  firstName: string;
  lastName: string;
}

interface CloseOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  acceptedProposal: AcceptedProposal | undefined;
  opportunityId: string;
  formData: OpportunityFormData;
  onOpportunityUpdate: (newFormData: OpportunityFormData) => void;
}

interface ReviewFormData {
  score: number;
  comment: string;
  images: string[];
}

const CloseOpportunityModal: React.FC<CloseOpportunityModalProps> = ({
  isOpen,
  onClose,
  acceptedProposal,
  opportunityId,
  formData,
  onOpportunityUpdate,
}) => {
  const { data: session } = useSession();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reviewData, setReviewData] = useState<ReviewFormData>({
    score: 0,
    comment: '',
    images: [],
  });

  const resetForm = () => {
    setReviewData({
      score: 0,
      comment: '',
      images: [],
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageChange = (imageData: string[]) => {
    setReviewData((prev) => ({
      ...prev,
      images: imageData,
    }));
  };

  const handleSubmitReview = async () => {
    if (!acceptedProposal) return;

    if (reviewData.score === 0) {
      toast({
        title: 'Calificación requerida',
        description: 'Por favor selecciona una calificación',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!reviewData.comment.trim()) {
      toast({
        title: 'Comentario requerido',
        description:
          'Por favor escribe un comentario sobre el trabajo realizado',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (reviewData.images.length === 0) {
      toast({
        title: 'Imagen requerida',
        description: 'Por favor sube al menos una imagen del trabajo realizado',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Create review
      const reviewResponse = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: acceptedProposal.workerId,
          reviewerId: session?.user?.id,
          score: reviewData.score,
          comment: reviewData.comment,
          imageUrl: reviewData.images[0], // Use the first image
        }),
      });

      if (!reviewResponse.ok) {
        throw new Error('Error al crear la evaluación');
      }

      // Update opportunity status to closed
      const updatedFormData = { ...formData, status: 'closed' as const };
      await updateOpportunity(opportunityId, updatedFormData);
      onOpportunityUpdate(updatedFormData);

      toast({
        title: 'Evaluación enviada',
        description:
          'La oportunidad ha sido cerrada y el trabajador evaluado exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      handleClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error al enviar evaluación',
        description:
          error instanceof Error ? error.message : 'Error desconocido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Evaluar trabajo realizado</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {acceptedProposal && (
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Evaluando a: {acceptedProposal.firstName}{' '}
                {acceptedProposal.lastName}
              </Text>

              {/* Score Selection */}
              <FormControl isRequired>
                <FormLabel>Calificación</FormLabel>
                <Flex gap={1}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconButton
                      key={star}
                      aria-label={`${star} estrellas`}
                      icon={<StarIcon />}
                      variant="ghost"
                      colorScheme={star <= reviewData.score ? 'yellow' : 'gray'}
                      color={
                        star <= reviewData.score ? 'yellow.400' : 'gray.300'
                      }
                      size="lg"
                      onClick={() =>
                        setReviewData((prev) => ({ ...prev, score: star }))
                      }
                    />
                  ))}
                </Flex>
                {reviewData.score > 0 && (
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    {reviewData.score} de 5 estrellas
                  </Text>
                )}
              </FormControl>

              {/* Comment */}
              <FormControl isRequired>
                <FormLabel>Comentario</FormLabel>
                <Textarea
                  placeholder="Describe cómo fue el trabajo realizado..."
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  rows={4}
                />
              </FormControl>

              {/* Image Upload */}
              <FormControl isRequired>
                <FormLabel>Imagen del trabajo realizado</FormLabel>
                <DragAndDropImage
                  onImageChange={handleImageChange}
                  maxImages={3}
                  initialImages={reviewData.images}
                />
                {reviewData.images.length === 0 && (
                  <Alert status="info" mt={2} fontSize="sm">
                    <AlertIcon />
                    Es necesario subir al menos una imagen del trabajo realizado
                  </Alert>
                )}
              </FormControl>

              {/* Action Buttons */}
              <HStack spacing={3} pt={4}>
                <Button
                  colorScheme="brand"
                  onClick={handleSubmitReview}
                  isLoading={isSubmitting}
                  loadingText="Enviando..."
                  flex={1}
                  fontSize="sm"
                >
                  Enviar evaluación y cerrar
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  flex={1}
                  fontSize="sm"
                >
                  Cancelar
                </Button>
              </HStack>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CloseOpportunityModal;
