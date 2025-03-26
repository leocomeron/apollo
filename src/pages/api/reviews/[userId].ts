import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

interface ReviewDocument {
  _id: ObjectId;
  userId: ObjectId;
  reviewerId: ObjectId;
  score: number;
  comment?: string;
  imageUrl?: string;
  date: Date;
  reviewer?: {
    firstName: string;
    lastName: string;
    profilePicture?: string;
    isVerified: boolean;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = await clientPromise;
  const db = client.db('worker_hub');
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ message: 'Valid user ID is required' });
  }

  switch (req.method) {
    case 'GET':
      try {
        // Get reviews for the specified user
        const reviews = await db
          .collection('reviews')
          .find({ userId })
          .toArray();

        // Get the reviewer details for each review
        const reviewsWithUserDetails: ReviewDocument[] = await Promise.all(
          reviews.map(async (review) => {
            const reviewer = await db.collection('users').findOne(
              { _id: new ObjectId(review.reviewerId) },
              {
                projection: {
                  firstName: 1,
                  lastName: 1,
                  documents: 1,
                  isVerified: 1,
                },
              },
            );

            const profilePicture = reviewer?.documents?.find(
              (doc: any) => doc.type === 'profilePicture',
            )?.url;

            return {
              ...review,
              reviewer: reviewer
                ? {
                    firstName: reviewer.firstName,
                    lastName: reviewer.lastName,
                    profilePicture,
                    isVerified: reviewer.isVerified,
                  }
                : {
                    firstName: 'Usuario',
                    lastName: 'Anónimo',
                    isVerified: false,
                  },
            } as ReviewDocument;
          }),
        );

        // Calculate average rating
        const totalReviews = reviewsWithUserDetails.length;
        const averageRating =
          totalReviews > 0
            ? reviewsWithUserDetails.reduce(
                (sum, review) => sum + review.score,
                0,
              ) / totalReviews
            : 0;

        // Format response
        const response = {
          reviews: reviewsWithUserDetails,
          stats: {
            totalReviews,
            averageRating,
            breakdown: [5, 4, 3, 2, 1].map((score) => ({
              score,
              count: reviewsWithUserDetails.filter(
                (review) => Math.floor(review.score) === score,
              ).length,
            })),
          },
        };

        res.status(200).json(response);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
          message: 'Error fetching reviews',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
