import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} not allowed`);
  }

  const client = await clientPromise;
  const db = client.db('worker_hub');
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ message: 'Valid user ID is required' });
  }

  try {
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      {
        projection: {
          email: 1,
          firstName: 1,
        },
      },
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      email: user.email,
      firstName: user.firstName,
    });
  } catch (error) {
    console.error('Error fetching user email:', error);
    res.status(500).json({
      message: 'Error fetching user email',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
