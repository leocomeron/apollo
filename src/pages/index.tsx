import { OpportunitiesSection, WorkersSection } from '@/components/sections';
import fetcher from '@/lib/fetcher';
import { Category } from '@/types/onboarding';
import { Opportunity } from '@/types/opportunities';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
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
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users?isWorker=true`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catalogs/categories`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities?status=open`),
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
    <div className="items-center justify-items-center p-2 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Tabs variant="enclosed" size="lg" colorScheme="brand">
        <TabList>
          <Tab>Trabajadores</Tab>
          <Tab>Oportunidades</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <WorkersSection
              workers={workers || []}
              categories={categories || []}
            />
          </TabPanel>

          <TabPanel>
            <OpportunitiesSection opportunities={opportunities || []} />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mt-8">
        HOME FOOTER
      </footer>
    </div>
  );
}
