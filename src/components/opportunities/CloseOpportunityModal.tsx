import UserLink from '@/components/common/UserLink';
import DragAndDropImage from '@/components/DragAndDrop/DragAndDropImage';
import StarIcon from '@/components/icons/StarIcon';
import { OpportunityFormData } from '@/types/opportunities';
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
  VStack,
  useToast,
} from '@chakra-ui/react';
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
  const [reviewData, setReviewData] = useState<ReviewFormData>({
    score: 0,
    comment: '',
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

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
    setReviewData((prev) => ({ ...prev, images: imageData }));
  };

  const handleSubmitReview = async () => {
    if (
      !acceptedProposal ||
      reviewData.score === 0 ||
      !reviewData.comment.trim() ||
      reviewData.images.length === 0
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit review
      const reviewResponse = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: acceptedProposal.workerId,
          reviewerId: 'current-user-id', // This should come from session
          score: reviewData.score,
          comment: reviewData.comment,
          imageUrl: reviewData.images[0], // For now, just use the first image
        }),
      });

      if (!reviewResponse.ok) {
        throw new Error('Failed to submit review');
      }

      // Close opportunity
      const opportunityResponse = await fetch(
        `/api/opportunities/${opportunityId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'closed',
          }),
        },
      );

      if (!opportunityResponse.ok) {
        throw new Error('Failed to close opportunity');
      }

      // Update local state
      onOpportunityUpdate({
        ...formData,
        status: 'closed',
      });

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
                Evaluando a:{' '}
                <UserLink userId={acceptedProposal.workerId}>
                  {acceptedProposal.firstName} {acceptedProposal.lastName}
                </UserLink>
              </Text>

              {/* Score Selection */}
              <FormControl isRequired>
                <FormLabel>Calificación</FormLabel>
                <Flex gap={1}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconButton
                      key={star}
                      aria-label={`${star} estrellas`}
                      icon={<StarIcon filled={star <= reviewData.score} />}
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
                  fontSize="xs"
                >
                  Enviar evaluación y cerrar
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  flex={1}
                  fontSize="xs"
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
