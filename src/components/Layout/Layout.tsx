// src/components/Layout.tsx
import { Box } from '@chakra-ui/react';
import Script from 'next/script';
import { ReactNode } from 'react';
import Menu from '../Menu';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Manos a la Obra',
            description:
              'Plataforma para conectar clientes con trabajadores calificados en oficios y construcción en Argentina',
            url: 'https://manosalaobra.com.ar',
            potentialAction: {
              '@type': 'SearchAction',
              target:
                'https://manosalaobra.com.ar/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
            sameAs: ['https://manosalaobra.com.ar'],
          }),
        }}
      />
      <Box p={4}>
        <Menu />
        <Box pt={4} px={{ base: 0, md: 8 }}>
          {children}
        </Box>
      </Box>
    </>
  );
}
