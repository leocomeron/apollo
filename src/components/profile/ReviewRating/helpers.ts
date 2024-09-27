import { Review } from './ReviewRating';

/**
 * Calculates review statistics including the average rating, total number of reviews,
 * and the breakdown of reviews by star ratings (5, 4, 3, 2, 1 stars).
 *
 * @param {Review[]} reviews - An array of review objects where each object contains a score and a comment.
 * @returns {Object} An object containing:
 *   - `rating`: The average rating value (0 if no reviews exist).
 *   - `totalReviews`: The total number of reviews.
 *   - `breakdown`: An array of objects, each representing a star rating (5 to 1) and the number of reviews with that rating.
 */
export const getReviewDetails = (reviews: Review[]) => {
  const totalReviews = reviews.length;

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    stars: star,
    reviews: reviews.filter((review) => Math.floor(review.score) === star)
      .length,
  }));

  const rating =
    totalReviews > 0
      ? reviews.reduce((acc, review) => acc + review.score, 0) / totalReviews
      : 0;

  return { rating, totalReviews, breakdown };
};
