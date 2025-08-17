import StarIcon from '@/components/icons/StarIcon';
import { Opportunity } from '@/types/opportunities';
import {
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
import { useSession } from 'next-auth/react';
import { useState } from 'react';

interface WorkerReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  onOpportunityUpdate: (newFormData: Opportunity) => void;
}

interface ReviewFormData {
  score: number;
  comment: string;
}

const WorkerReviewModal: React.FC<WorkerReviewModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  onOpportunityUpdate,
}) => {
  const { data: session } = useSession();
  const [reviewData, setReviewData] = useState<ReviewFormData>({
    score: 0,
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const isSubmitDisabled =
    reviewData.score === 0 || !reviewData.comment.trim() || !session?.user?.id;

  const resetForm = () => {
    setReviewData({
      score: 0,
      comment: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmitReview = async () => {
    if (isSubmitDisabled) return;

    setIsSubmitting(true);

    try {
      // Submit review
      const reviewResponse = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: opportunity.userId,
          reviewerId: session.user.id,
          score: reviewData.score,
          comment: reviewData.comment,
        }),
      });

      if (!reviewResponse.ok) {
        throw new Error('Failed to submit review');
      }

      // Update opportunity status from completed to closed
      const opportunityResponse = await fetch(
        `/api/opportunities/${opportunity._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'closed',
          }),
        },
      );

      if (!opportunityResponse.ok) {
        throw new Error('Failed to update opportunity status');
      }

      // Update local state
      onOpportunityUpdate({
        ...opportunity,
        status: 'closed',
      });

      toast({
        title: 'Reseña enviada',
        description:
          'Tu reseña ha sido enviada exitosamente y la oportunidad ha sido marcada como finalizada',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      handleClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error al enviar reseña',
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
        <ModalHeader>Evalúa a al dueño de la oportunidad</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.600">
              Evaluando a: <strong>{opportunity.ownerFirstName}</strong>
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
                    color={star <= reviewData.score ? 'yellow.400' : 'gray.300'}
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
                placeholder="Describe tu experiencia trabajando con este empleador..."
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

            {/* Action Buttons */}
            <HStack spacing={3} pt={4}>
              <Button
                colorScheme="brand"
                disabled={isSubmitDisabled}
                onClick={handleSubmitReview}
                isLoading={isSubmitting}
                loadingText="Enviando..."
                flex={1}
                fontSize="xs"
              >
                Enviar evaluación
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WorkerReviewModal;
