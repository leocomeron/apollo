import { ReviewStats } from './review';

export type ProposalStatus = 'pending' | 'accepted' | 'rejected';

export interface Proposal {
  id: string;
  workerId: string;
  opportunityId: string;
  budget: number;
  status: ProposalStatus;
  firstName: string;
  lastName: string;
  profileImage: string;
  reviewStats: ReviewStats;
}
