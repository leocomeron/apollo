export const useEmailNotifications = () => {
  const sendOpportunityNotification = async (
    email: string,
    opportunityTitle: string,
    opportunityId: string,
  ) => {
    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          subject: 'Nueva Oportunidad Disponible',
          message: `Se ha publicado una nueva oportunidad: "${opportunityTitle}". ¡Revisa si es para ti!`,
          actionUrl: `/opportunities/${opportunityId}`,
          actionText: 'Ver Oportunidad',
        }),
      });
    } catch (error) {
      console.error('Failed to send opportunity notification:', error);
    }
  };

  const sendProposalNotification = async (
    email: string,
    opportunityTitle: string,
    opportunityId: string,
  ) => {
    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          subject: 'Nueva Propuesta Recibida',
          message: `Has recibido una nueva propuesta para la oportunidad: "${opportunityTitle}".`,
          actionUrl: `/opportunities/${opportunityId}`,
          actionText: 'Ver Propuesta',
        }),
      });
    } catch (error) {
      console.error('Failed to send proposal notification:', error);
    }
  };

  return {
    sendOpportunityNotification,
    sendProposalNotification,
  };
};
