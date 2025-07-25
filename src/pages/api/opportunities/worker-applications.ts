import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = await clientPromise;
  const db = client.db('worker_hub');

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} not allowed`);
  }

  try {
    const { workerId } = req.query;

    if (!workerId) {
      return res.status(400).json({ message: 'Worker ID is required' });
    }

    // Get all proposals for this worker
    const proposals = await db
      .collection('proposals')
      .find({ workerId: new ObjectId(workerId as string) })
      .toArray();

    if (proposals.length === 0) {
      return res.status(200).json([]);
    }

    // Get all opportunity IDs from proposals
    const opportunityIds = proposals.map((p) => new ObjectId(p.opportunityId));

    // Get all opportunities with creator information
    const opportunities = await db
      .collection('opportunities')
      .aggregate([
        { $match: { _id: { $in: opportunityIds } } },
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
            ownerFirstName: { $arrayElemAt: ['$owner.firstName', 0] },
          },
        },
        {
          $project: {
            owner: 0,
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    // Create a map of proposals by opportunity ID
    const proposalsByOpportunity: Record<string, any> = {};
    proposals.forEach((proposal) => {
      proposalsByOpportunity[proposal.opportunityId] = {
        id: proposal._id.toString(),
        budget: proposal.budget,
        status: proposal.status,
        createdAt: proposal.createdAt,
        updatedAt: proposal.updatedAt,
      };
    });

    // Combine opportunities with their proposal data
    const opportunitiesWithProposals = opportunities.map((opportunity) => ({
      ...opportunity,
      proposal: proposalsByOpportunity[opportunity._id.toString()],
    }));

    res.status(200).json(opportunitiesWithProposals);
  } catch (error) {
    console.error('Error fetching worker applications:', error);
    res.status(500).json({
      message: 'Error fetching worker applications',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
