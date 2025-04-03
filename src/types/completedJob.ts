import { ObjectId } from 'mongodb';

export interface CompletedJob {
  _id?: string | ObjectId;
  userId: string | ObjectId;
  imageUrl: string;
  description: string;
  date: string | Date;
}
