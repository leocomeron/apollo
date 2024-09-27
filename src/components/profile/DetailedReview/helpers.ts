import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const timeAgo = (dateString: string) => {
  const reviewDate = new Date(dateString);

  const distance = formatDistanceToNow(reviewDate, {
    addSuffix: true,
    locale: es,
  });

  return distance.replace('hace', 'Hace');
};
