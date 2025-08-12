import type { OpportunityStatus } from '@/types/opportunities';
import { Badge } from '@chakra-ui/react';

interface StatusBadgeProps {
  status: OpportunityStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: OpportunityStatus) => {
    switch (status) {
      case 'open':
        return 'green';
      case 'in_progress':
        return 'blue';
      case 'completed':
        return 'green';
      case 'closed':
        return 'green';
      case 'canceled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: OpportunityStatus) => {
    switch (status) {
      case 'open':
        return 'Abierta';
      case 'in_progress':
        return 'En curso';
      case 'completed':
        return 'Completada';
      case 'closed':
        return 'Cerrada';
      case 'canceled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <Badge
      colorScheme={getStatusColor(status)}
      fontSize="sm"
      px={2}
      py={1}
      borderRadius="md"
    >
      {getStatusText(status)}
    </Badge>
  );
};

export default StatusBadge;
