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

        const opportunities = await db
          .collection('opportunities')
          .find({ userId: new ObjectId(userId as string) })
          .sort({ createdAt: -1 })
          .toArray();

        res.status(200).json(opportunities);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        res.status(500).json({
          message: 'Error fetching opportunities',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    case 'POST':
      try {
        const {
          userId,
          title,
          description,
          categories,
          location,
          type,
          startDate,
          images,
          status,
        } = req.body;

        if (
          !userId ||
          !title ||
          !description ||
          !categories ||
          !location ||
          !type ||
          !startDate ||
          !images
        ) {
          return res.status(400).json({ message: 'Missing required fields' });
        }

        const newOpportunity = {
          userId: new ObjectId(userId),
          title,
          description,
          categories,
          location,
          type,
          startDate,
          images,
          status: status || 'open',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await db
          .collection('opportunities')
          .insertOne(newOpportunity);

        res.status(201).json({
          message: 'Opportunity created successfully',
          opportunityId: result.insertedId,
        });
      } catch (error) {
        console.error('Error creating opportunity:', error);
        res.status(500).json({
          message: 'Error creating opportunity',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
