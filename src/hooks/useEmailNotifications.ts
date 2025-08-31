export const useEmailNotifications = () => {
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
    sendProposalNotification,
  };
};
