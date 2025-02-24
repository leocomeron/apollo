import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email, password } = req.body;

  const client = await clientPromise;
  const db = client.db('worker_hub');

  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  await db.collection('users').insertOne({
    email,
    password: hashedPassword,
    createdAt: new Date(),
    firstName: null,
    lastName: null,
    birthDate: null,
    location: null,
    isOnboardingCompleted: false,
  });

  res.status(201).json({ message: 'User created successfully' });
}
