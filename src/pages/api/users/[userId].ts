import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

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
        const user = await db.collection('users').findOne(
          { _id: new ObjectId(userId) },
          {
            projection: {
              password: 0,
              email: 0,
              contact: 0,
            },
          },
        );

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // If user is a worker, include review statistics
        if (user.isWorker) {
          const reviews = await db
            .collection('reviews')
            .find({ userId: new ObjectId(userId) })
            .toArray();

          const totalReviews = reviews.length;
          const averageRating =
            totalReviews > 0
              ? reviews.reduce((sum, review) => sum + review.score, 0) /
                totalReviews
              : 0;

          user.rating = {
            average: averageRating,
            total: totalReviews,
          };
        }

        res.status(200).json(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
          message: 'Error fetching user',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
