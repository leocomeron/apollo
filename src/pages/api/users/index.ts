import clientPromise from '@/lib/mongodb';
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
        res.status(200).json(users);
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

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
