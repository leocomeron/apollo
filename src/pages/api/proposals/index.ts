import clientPromise from '@/lib/mongodb';
import { EmailService } from '@/services/email';
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

        // Check if opportunity exists and is open, and get owner information
        const opportunityWithOwner = await db
          .collection('opportunities')
          .aggregate([
            { $match: { _id: new ObjectId(opportunityId) } },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'owner',
              },
            },
            {
              $addFields: {
                ownerEmail: { $arrayElemAt: ['$owner.email', 0] },
                ownerFirstName: { $arrayElemAt: ['$owner.firstName', 0] },
                ownerId: { $arrayElemAt: ['$owner._id', 0] },
              },
            },
            {
              $project: {
                owner: 0,
              },
            },
          ])
          .toArray();

        if (!opportunityWithOwner || opportunityWithOwner.length === 0) {
          return res.status(404).json({ message: 'Oportunidad no encontrada' });
        }

        const opportunity = opportunityWithOwner[0];

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
        // Send notification email to opportunity owner
        await EmailService.sendProposalNotification(
          opportunity.ownerEmail,
          opportunity.title,
          opportunity._id.toString(),
          opportunity.ownerFirstName,
        );
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
