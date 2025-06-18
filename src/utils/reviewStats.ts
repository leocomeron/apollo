export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  breakdown: Array<{
    score: number;
    count: number;
  }>;
}

export function calculateReviewStats(scores: number[]): ReviewStats {
  if (scores.length === 0) {
    return {
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
  }

  const totalReviews = scores.length;
  const averageRating =
    scores.reduce((sum, score) => sum + score, 0) / totalReviews;

  const breakdown = [5, 4, 3, 2, 1].map((score) => ({
    score,
    count: scores.filter((s) => s === score).length,
  }));

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    breakdown,
  };
}
