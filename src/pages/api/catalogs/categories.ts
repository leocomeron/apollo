import clientPromise from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = await clientPromise;
  const db = client.db('catalogs');

  switch (req.method) {
    case 'GET':
      try {
        const categories = await db.collection('categories').find({}).toArray();
        res.status(200).json(categories);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
