import { ReviewStats } from './review';

export interface Proposal {
  id: string;
  workerId: string;
  opportunityId: string;
  budget: number;
  status: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  reviewStats: ReviewStats;
}
