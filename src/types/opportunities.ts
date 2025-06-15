export interface OpportunityFormData {
  images: string[];
  title: string;
  categories: string[];
  description: string;
  location: string;
  type: string;
  startDate: string;
  status: 'open' | 'in_progress' | 'closed';
}

export interface Opportunity {
  _id: string;
  title: string;
  images: string[];
  createdAt: string;
  status: 'open' | 'in_progress' | 'closed';
  description: string;
  categories: string[];
  location: string;
  type: string;
  startDate: string;
}
