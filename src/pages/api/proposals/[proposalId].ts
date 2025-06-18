import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = await clientPromise;
  const db = client.db('worker_hub');

  const { proposalId } = req.query;

  if (!proposalId || typeof proposalId !== 'string') {
    return res.status(400).json({ message: 'Invalid proposal ID' });
  }

  switch (req.method) {
    case 'PUT':
      try {
        const { status } = req.body;

        if (!status) {
          return res.status(400).json({ message: 'Status is required' });
        }

        const result = await db
          .collection('proposals')
          .updateOne(
            { _id: new ObjectId(proposalId) },
            { $set: { status, updatedAt: new Date() } },
          );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Proposal not found' });
        }

        res.status(200).json({
          message: 'Proposal updated successfully',
          modifiedCount: result.modifiedCount,
        });
      } catch (error) {
        console.error('Error updating proposal:', error);
        res.status(500).json({
          message: 'Error updating proposal',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
