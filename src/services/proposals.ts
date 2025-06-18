const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const updateProposal = async (
  proposalId: string,
  status: 'pending' | 'accepted' | 'rejected',
): Promise<void> => {
  const response = await fetch(`${API_URL}/api/proposals/${proposalId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar la propuesta');
  }
};

export const updateAllProposalsForOpportunity = async (
  opportunityId: string,
  acceptedProposalId: string,
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/api/opportunities/${opportunityId}/proposals`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ acceptedProposalId }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar las propuestas');
  }
};
