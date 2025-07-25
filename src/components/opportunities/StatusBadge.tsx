import { Badge } from '@chakra-ui/react';

interface StatusBadgeProps {
  status: 'open' | 'in_progress' | 'closed';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'green';
      case 'in_progress':
        return 'blue';
      case 'closed':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Abierta';
      case 'in_progress':
        return 'En curso';
      case 'closed':
        return 'Cerrada';
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
