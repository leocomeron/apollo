import WorkerCard from '@/components/WorkerCard';
import fetcher from '@/lib/fetcher';
import { Category } from '@/types/onboarding';
import { getProfilePictureUrl } from '@/utils/user';
import { Box, Grid, Input, Tag, Wrap, WrapItem } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import useSWR from 'swr';
import { User } from './api/users/types';

interface HomeProps {
  initialWorkers: User[];
  initialCategories: Category[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [workersRes, categoriesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users?isWorker=true`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catalogs/categories`),
    ]);

    const [workers, categories] = await Promise.all([
      workersRes.json(),
      categoriesRes.json(),
    ]);

    return {
      props: {
        initialWorkers: workers,
        initialCategories: categories,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        initialWorkers: [],
        initialCategories: [],
      },
    };
  }
};

export default function Home({ initialWorkers, initialCategories }: HomeProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: workers } = useSWR<User[]>(
    '/api/users?isWorker=true',
    fetcher,
    {
      fallbackData: initialWorkers,
      revalidateOnMount: false,
      refreshInterval: 30000,
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category],
    );
  };

  const filteredWorkers = workers?.filter((worker) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearchTerm =
      worker.firstName.toLowerCase().includes(searchLower) ||
      worker.lastName.toLowerCase().includes(searchLower) ||
      worker?.categories?.includes(searchLower) ||
      worker?.description?.toLowerCase().includes(searchLower) ||
      worker.contact.location.toLowerCase().includes(searchLower);

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((category) =>
        worker?.categories?.includes(category),
      );

    return matchesSearchTerm && matchesCategory;
  });

  return (
    <div
      className={
        'items-center justify-items-center p-2 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]'
      }
    >
      <Box width="100%" maxW="600px" m={4}>
        <Input
          placeholder="Busca tu profesional..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>
      <Wrap spacing={2} mb={4}>
        {categories?.map((category) => (
          <WrapItem key={category.value}>
            <Tag
              size="lg"
              variant="solid"
              bgColor="brand.600"
              cursor="pointer"
              px={{ base: 2, md: 6 }}
              py={{ base: 1, md: 3 }}
              borderRadius="50px"
              borderWidth="3px"
              borderColor={
                selectedCategories.includes(category.value)
                  ? 'brand.900'
                  : 'transparent'
              }
              onClick={() => handleCategoryClick(category.value)}
            >
              {category.label}
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
          xl: 'repeat(4, 1fr)',
        }}
        gap={4}
      >
        {filteredWorkers?.map((worker) => (
          <WorkerCard
            key={worker._id}
            profilePicture={getProfilePictureUrl(worker)}
            rating={worker.rating?.average ?? 0}
            firstName={worker.firstName}
            lastName={worker.lastName}
            professions={worker.categories ?? []}
            description={worker?.description ?? ''}
            location={worker.contact.location}
          />
        ))}
      </Grid>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        HOME FOOTER
      </footer>
    </div>
  );
}
