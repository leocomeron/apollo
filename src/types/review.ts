import { ObjectId } from 'mongodb';

export interface Review {
  _id?: ObjectId | string;
  userId: ObjectId | string;
  reviewerId: ObjectId | string;
  score: number;
  comment?: string;
  imageUrl?: string;
  date: Date | string;
  reviewer: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    isVerified: boolean;
  };
}
