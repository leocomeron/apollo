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
    case 'POST':
      try {
        const { workerId, opportunityId, budget, message } = req.body;

        if (!workerId || !opportunityId || !budget) {
          return res.status(400).json({
            message: 'workerId, opportunityId, and budget are required',
          });
        }

        // Check if user already has a proposal for this opportunity
        const existingProposal = await db.collection('proposals').findOne({
          workerId: new ObjectId(workerId),
          opportunityId: opportunityId,
        });

        if (existingProposal) {
          return res.status(400).json({
            message: 'Ya has enviado una propuesta para esta oportunidad',
          });
        }

        // Check if opportunity exists and is open
        const opportunity = await db
          .collection('opportunities')
          .findOne({ _id: new ObjectId(opportunityId) });

        if (!opportunity) {
          return res.status(404).json({ message: 'Oportunidad no encontrada' });
        }

        if (opportunity.status !== 'open') {
          return res.status(400).json({
            message: 'Esta oportunidad ya no está disponible',
          });
        }

        const newProposal = {
          workerId: new ObjectId(workerId),
          opportunityId: opportunityId,
          budget: Number(budget),
          message: message || '',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await db.collection('proposals').insertOne(newProposal);

        res.status(201).json({
          message: 'Propuesta enviada exitosamente',
          proposalId: result.insertedId,
        });
      } catch (error) {
        console.error('Error creating proposal:', error);
        res.status(500).json({
          message: 'Error al crear la propuesta',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
