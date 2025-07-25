import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

interface UserFilter {
  isWorker?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = await clientPromise;
  const db = client.db('worker_hub');

  switch (req.method) {
    case 'GET':
      try {
        const { isWorker } = req.query;

        const filter: UserFilter = {};

        if (isWorker) {
          filter.isWorker = isWorker === 'true';
        }

        const users = await db.collection('users').find(filter).toArray();

        // If fetching workers, include review statistics
        if (filter.isWorker) {
          const usersWithReviews = await Promise.all(
            users.map(async (user) => {
              // Get reviews for this user
              const reviews = await db
                .collection('reviews')
                .find({ userId: user._id })
                .toArray();

              // Calculate review statistics
              const totalReviews = reviews.length;
              const averageRating =
                totalReviews > 0
                  ? reviews.reduce((sum, review) => sum + review.score, 0) /
                    totalReviews
                  : 0;

              return {
                ...user,
                rating: {
                  average: averageRating,
                  total: totalReviews,
                },
              };
            }),
          );

          res.status(200).json(usersWithReviews);
        } else {
          res.status(200).json(users);
        }
      } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
      }
      break;

    case 'POST':
      try {
        const newUser = req.body;

        const result = await db.collection('users').insertOne(newUser);
        res
          .status(201)
          .json({ message: 'User created', userId: result.insertedId });
      } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
      }
      break;

    case 'PATCH':
      try {
        const { userId, ...updateData } = req.body;

        if (!userId) {
          return res.status(400).json({ message: 'User ID is required' });
        }

        const result = await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              ...updateData,
              updatedAt: new Date(),
            },
          },
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
      } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
          message: 'Error updating user',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
      res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
