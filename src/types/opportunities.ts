export type OpportunityStatus =
  | 'open' // Opportunity is open for proposals
  | 'in_progress' // Opportunity is in progress with an accepted proposal
  | 'completed' // Opportunity is finished and the owner left a review
  | 'closed' // Opportunity last status, the worker left a review
  | 'canceled'; // Opportunity is canceled by the owner

export interface OpportunityFormData {
  images: string[];
  title: string;
  categories: string[];
  description: string;
  location: string;
  type: string;
  startDate: string;
  status: OpportunityStatus;
}

export interface Opportunity {
  _id: string;
  userId: string;
  ownerFirstName?: string;
  title: string;
  images: string[];
  createdAt: string;
  status: OpportunityStatus;
  description: string;
  categories: string[];
  location: string;
  type: string;
  startDate: string;
}
