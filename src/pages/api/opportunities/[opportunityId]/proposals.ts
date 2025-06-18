import clientPromise from '@/lib/mongodb';
import { User } from '@/pages/api/users/types';
import { DocumentType } from '@/types/onboarding';
import { calculateReviewStats } from '@/utils/reviewStats';
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
    const { opportunityId } = req.query;

    if (!opportunityId) {
      return res.status(400).json({ message: 'Opportunity ID is required' });
    }

    // Get all proposals for this opportunity
    const proposals = await db
      .collection('proposals')
      .find({ opportunityId: opportunityId })
      .toArray();

    // Get all worker IDs from proposals
    const workerIds = proposals.map((p) => new ObjectId(p.workerId));

    // Get all workers data
    const workers = await db
      .collection('users')
      .find({ _id: { $in: workerIds } })
      .toArray();

    // Get all reviews for these workers
    const reviews = await db
      .collection('reviews')
      .find({ userId: { $in: workerIds } })
      .toArray();

    // Create a map of reviews by worker ID
    const reviewsByWorker: Record<string, number[]> = {};
    reviews.forEach((review) => {
      const workerId = review.userId.toString();
      if (!reviewsByWorker[workerId]) {
        reviewsByWorker[workerId] = [];
      }
      reviewsByWorker[workerId].push(review.score);
    });

    // Create a map of worker data for easy lookup
    const workerMap: Record<string, User> = workers.reduce(
      (acc, worker) => {
        acc[worker._id.toString()] = worker as unknown as User;
        return acc;
      },
      {} as Record<string, User>,
    );

    // Combine proposal and worker data
    const enrichedProposals = proposals.map((proposal) => {
      const worker = workerMap[proposal.workerId.toString()];
      const profilePictureUrl =
        worker?.documents?.find(
          (document) => document.type === DocumentType.ProfilePicture,
        )?.url ||
        worker?.profilePicture ||
        '';

      const workerReviews = reviewsByWorker[proposal.workerId.toString()] || [];
      const reviewStats = calculateReviewStats(workerReviews);

      return {
        id: proposal._id.toString(),
        workerId: proposal.workerId.toString(),
        name: worker?.firstName || '',
        lastName: worker?.lastName || '',
        profileImage: profilePictureUrl,
        budget: proposal.budget,
        reviewStats,
        status: proposal.status,
      };
    });

    res.status(200).json(enrichedProposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({
      message: 'Error fetching proposals',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
