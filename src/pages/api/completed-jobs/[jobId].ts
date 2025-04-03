import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = await clientPromise;
  const db = client.db('worker_hub');
  const { jobId } = req.query;

  if (!jobId || typeof jobId !== 'string') {
    return res.status(400).json({ message: 'Valid job ID is required' });
  }

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(jobId);
  } catch {
    return res.status(400).json({ message: 'Invalid job ID format' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const job = await db
          .collection('completed_jobs')
          .findOne({ _id: objectId });

        if (!job) {
          return res.status(404).json({ message: 'Completed job not found' });
        }

        res.status(200).json(job);
      } catch (error) {
        console.error('Error fetching completed job:', error);
        res.status(500).json({
          message: 'Error fetching completed job',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    case 'PUT':
      try {
        const { imageUrl, description } = req.body;

        const updates: { [key: string]: unknown } = {};
        if (imageUrl) updates.imageUrl = imageUrl;
        if (description !== undefined) updates.description = description;

        if (Object.keys(updates).length === 0) {
          return res.status(400).json({ message: 'No valid updates provided' });
        }

        const result = await db
          .collection('completed_jobs')
          .updateOne({ _id: objectId }, { $set: updates });

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Completed job not found' });
        }

        res.status(200).json({
          message: 'Completed job updated successfully',
          modifiedCount: result.modifiedCount,
        });
      } catch (error) {
        console.error('Error updating completed job:', error);
        res.status(500).json({
          message: 'Error updating completed job',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    case 'DELETE':
      try {
        const result = await db.collection('completed_jobs').deleteOne({
          _id: objectId,
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Completed job not found' });
        }

        res.status(200).json({ message: 'Completed job deleted successfully' });
      } catch (error) {
        console.error('Error deleting completed job:', error);
        res.status(500).json({
          message: 'Error deleting completed job',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
