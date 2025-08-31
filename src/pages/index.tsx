import Footer from '@/components/Footer';
import { OpportunitiesSection, WorkersSection } from '@/components/sections';
import { env } from '@/lib/env';
import fetcher from '@/lib/fetcher';
import { Category } from '@/types/onboarding';
import { Opportunity } from '@/types/opportunities';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import useSWR from 'swr';
import { User } from './api/users/types';

interface HomeProps {
  initialWorkers: User[];
  initialCategories: Category[];
  initialOpportunities: Opportunity[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [workersRes, categoriesRes, opportunitiesRes] = await Promise.all([
      fetch(`${env.app.next_public_api_url}/api/users?isWorker=true`),
      fetch(`${env.app.next_public_api_url}/api/catalogs/categories`),
      fetch(`${env.app.next_public_api_url}/api/opportunities?status=open`),
    ]);

    const [workers, categories, opportunities] = await Promise.all([
      workersRes.json(),
      categoriesRes.json(),
      opportunitiesRes.json(),
    ]);

    return {
      props: {
        initialWorkers: workers,
        initialCategories: categories,
        initialOpportunities: opportunities,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        initialWorkers: [],
        initialCategories: [],
        initialOpportunities: [],
      },
    };
  }
};

export default function Home({
  initialWorkers,
  initialCategories,
  initialOpportunities,
}: HomeProps) {
  const { data: workers } = useSWR<User[]>(
    '/api/users?isWorker=true',
    fetcher,
    {
      fallbackData: initialWorkers,
      revalidateOnMount: false,
    },
  );

  const { data: categories } = useSWR<Category[]>(
    '/api/catalogs/categories',
    fetcher,
    {
      fallbackData: initialCategories,
      revalidateOnMount: false,
    },
  );

  const { data: opportunities } = useSWR<Opportunity[]>(
    '/api/opportunities?status=open',
    fetcher,
    {
      fallbackData: initialOpportunities,
      revalidateOnMount: false,
    },
  );

  return (
    <>
      <Head>
        <title>
          Manos a la Obra - Encuentra Albañiles, Gasistas y Plomeros en
          Argentina
        </title>
        <meta
          name="description"
          content="Encuentra trabajadores calificados para tus proyectos: albañiles, gasistas, plomeros y más oficios en Argentina. Publica trabajos o encuentra trabajo fácilmente."
        />
        <meta
          name="keywords"
          content="albañil argentina, gasista buenos aires, plomero, oficios, construcción, trabajo, mano de obra, servicios"
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Manos a la Obra - Encuentra Trabajadores Calificados"
        />
        <meta
          property="og:description"
          content="Plataforma líder para conectar clientes con trabajadores calificados en Argentina"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_AR" />
        <link rel="canonical" href="https://manosalaobra.com.ar" />
      </Head>
      <div className="items-center p-2 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Tabs size="lg" colorScheme="brand" borderColor="white">
          <TabList>
            <Tab fontWeight="bold">Oportunidades</Tab>
            <Tab fontWeight="bold">Trabajadores</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <OpportunitiesSection opportunities={opportunities || []} />
            </TabPanel>

            <TabPanel>
              <WorkersSection
                workers={workers || []}
                categories={categories || []}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
      <Footer />
    </>
  );
}
