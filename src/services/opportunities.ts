import { OpportunityFormData } from '@/types/opportunities';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const updateOpportunity = async (
  opportunityId: string,
  data: OpportunityFormData,
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/api/opportunities/${opportunityId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar la oportunidad');
  }
};

export const deleteOpportunity = async (
  opportunityId: string,
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/api/opportunities/${opportunityId}`,
    {
      method: 'DELETE',
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar la oportunidad');
  }
};
