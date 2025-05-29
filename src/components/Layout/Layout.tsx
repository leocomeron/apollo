// src/components/Layout.tsx
import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Menu from '../Menu';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box m={4}>
      <Menu />
      <Box pt={8} px={8}>
        {children}
      </Box>
    </Box>
  );
}
