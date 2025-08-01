import { Review, ReviewStats } from '@/types/review';
import { useEffect, useState } from 'react';

interface UseUserReviewsResult {
  reviews: Review[];
  reviewStats: ReviewStats;
  isLoading: boolean;
  error: Error | null;
}

const DEFAULT_REVIEW_STATS: ReviewStats = {
  totalReviews: 0,
  averageRating: 0,
  breakdown: [
    { score: 5, count: 0 },
    { score: 4, count: 0 },
    { score: 3, count: 0 },
    { score: 2, count: 0 },
    { score: 1, count: 0 },
  ],
};

export function useUserReviews(userId?: string): UseUserReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] =
    useState<ReviewStats>(DEFAULT_REVIEW_STATS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/reviews/${userId}`);

        if (!response.ok) {
          throw new Error(`Error fetching reviews: ${response.statusText}`);
        }

        const data = await response.json();
        setReviews(data.reviews);
        setReviewStats(data.stats);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('An unknown error occurred'),
        );
        console.error('Error fetching user reviews:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchReviews();
  }, [userId]);

  return { reviews, reviewStats, isLoading, error };
}
