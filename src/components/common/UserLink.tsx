import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

interface UserLinkProps {
  userId: string;
  children: ReactNode;
  onClick?: () => void;
}

const UserLink: React.FC<UserLinkProps> = ({ userId, children, onClick }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;
    if (onClick) {
      onClick();
    } else {
      void router.push(`/profile/${userId}`);
    }
  };

  return (
    <Box
      as="span"
      cursor="pointer"
      _hover={{ textDecoration: 'underline' }}
      onClick={handleClick}
    >
      {children}
    </Box>
  );
};

export default UserLink;
