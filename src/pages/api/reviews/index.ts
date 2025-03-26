import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = await clientPromise;
  const db = client.db('worker_hub');

  switch (req.method) {
    case 'GET':
      try {
        const { userId } = req.query;

        if (!userId) {
          return res.status(400).json({ message: 'User ID is required' });
        }

        // Get reviews for the specified user
        const reviews = await db
          .collection('reviews')
          .find({ userId: new ObjectId(userId as string) })
          .toArray();

        // Get the reviewer details for each review
        const reviewsWithUserDetails = await Promise.all(
          reviews.map(async (review) => {
            const reviewer = await db.collection('users').findOne(
              { _id: new ObjectId(review.reviewerId) },
              {
                projection: {
                  firstName: 1,
                  lastName: 1,
                  profilePicture: 1,
                  isVerified: 1,
                },
              },
            );

            return {
              ...review,
              reviewer: reviewer || {
                firstName: 'Unknown',
                lastName: 'User',
                isVerified: false,
              },
            };
          }),
        );

        res.status(200).json(reviewsWithUserDetails);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
          message: 'Error fetching reviews',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    case 'POST':
      try {
        const { userId, reviewerId, score, comment, imageUrl } = req.body;

        if (!userId || !reviewerId || !score) {
          return res
            .status(400)
            .json({ message: 'userId, reviewerId, and score are required' });
        }

        const newReview = {
          userId: new ObjectId(userId),
          reviewerId: new ObjectId(reviewerId),
          score: Number(score),
          comment: comment || null,
          imageUrl: imageUrl || null,
          date: new Date(),
        };

        const result = await db.collection('reviews').insertOne(newReview);
        res.status(201).json({
          message: 'Review created',
          reviewId: result.insertedId,
        });
      } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({
          message: 'Error creating review',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
