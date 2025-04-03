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

        // Get completed jobs for the specified user
        const completedJobs = await db
          .collection('completed_jobs')
          .find({ userId: new ObjectId(userId as string) })
          .sort({ date: -1 }) // Sort by date descending (newest first)
          .toArray();

        res.status(200).json(completedJobs);
      } catch (error) {
        console.error('Error fetching completed jobs:', error);
        res.status(500).json({
          message: 'Error fetching completed jobs',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    case 'POST':
      try {
        const { userId, imageUrl, description } = req.body;

        if (!userId || !imageUrl) {
          return res
            .status(400)
            .json({ message: 'userId and imageUrl are required' });
        }

        const newCompletedJob = {
          userId: new ObjectId(userId),
          imageUrl,
          description: description || '',
          date: new Date(),
        };

        const result = await db
          .collection('completed_jobs')
          .insertOne(newCompletedJob);
        res.status(201).json({
          message: 'Completed job created',
          jobId: result.insertedId,
        });
      } catch (error) {
        console.error('Error creating completed job:', error);
        res.status(500).json({
          message: 'Error creating completed job',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
