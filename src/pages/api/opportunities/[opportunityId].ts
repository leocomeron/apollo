import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = await clientPromise;
  const db = client.db('worker_hub');

  const { opportunityId } = req.query;

  if (!opportunityId || typeof opportunityId !== 'string') {
    return res.status(400).json({ message: 'Invalid opportunity ID' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const opportunity = await db
          .collection('opportunities')
          .findOne({ _id: new ObjectId(opportunityId) });

        if (!opportunity) {
          return res.status(404).json({ message: 'Opportunity not found' });
        }

        res.status(200).json(opportunity);
      } catch (error) {
        console.error('Error fetching opportunity:', error);
        res.status(500).json({
          message: 'Error fetching opportunity',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    case 'PUT':
      try {
        const {
          title,
          description,
          categories,
          location,
          type,
          startDate,
          images,
          status,
        } = req.body;

        const opportunity = await db
          .collection('opportunities')
          .findOne({ _id: new ObjectId(opportunityId) });

        if (!opportunity) {
          return res.status(404).json({ message: 'Opportunity not found' });
        }

        const updatedOpportunity = {
          ...opportunity,
          title: title || opportunity.title,
          description: description || opportunity.description,
          categories: categories || opportunity.categories,
          location: location || opportunity.location,
          type: type || opportunity.type,
          startDate: startDate || opportunity.startDate,
          images: images || opportunity.images,
          status: status || opportunity.status,
          updatedAt: new Date(),
        };

        await db
          .collection('opportunities')
          .updateOne(
            { _id: new ObjectId(opportunityId) },
            { $set: updatedOpportunity },
          );

        res.status(200).json({
          message: 'Opportunity updated successfully',
          opportunity: updatedOpportunity,
        });
      } catch (error) {
        console.error('Error updating opportunity:', error);
        res.status(500).json({
          message: 'Error updating opportunity',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    case 'DELETE':
      try {
        const result = await db
          .collection('opportunities')
          .deleteOne({ _id: new ObjectId(opportunityId) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Opportunity not found' });
        }

        res.status(200).json({ message: 'Opportunity deleted successfully' });
      } catch (error) {
        console.error('Error deleting opportunity:', error);
        res.status(500).json({
          message: 'Error deleting opportunity',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
