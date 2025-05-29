export interface OpportunityFormData {
  images: string[];
  title: string;
  categories: string[];
  description: string;
  location: string;
  type: string;
  startDate: string;
  status: 'open' | 'ongoing' | 'closed';
}
