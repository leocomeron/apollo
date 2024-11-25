import Menu from '@/components/Menu';
import WorkerCard from '@/components/WorkerCard';
import { categories } from '@/constants';
import { workerCardMock } from '@/mocks/workerCard';
import { Category } from '@/types/onboarding';
import { Box, Grid, Input, Tag, Wrap, WrapItem } from '@chakra-ui/react';
import { useState } from 'react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category],
    );
  };

  const filteredWorkers = workerCardMock.filter((worker) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearchTerm =
      worker.firstName.toLowerCase().includes(searchLower) ||
      worker.lastName.toLowerCase().includes(searchLower) ||
      worker.profession.toLowerCase().includes(searchLower) ||
      worker.description.toLowerCase().includes(searchLower) ||
      worker.location.toLowerCase().includes(searchLower);

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(worker.profession);

    return matchesSearchTerm && matchesCategory;
  });

  return (
    <div
      className={
        'items-center justify-items-center p-2 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]'
      }
    >
      <Menu />
      <Box width="100%" maxW="600px" m={4}>
        <Input
          placeholder="Busca tu profesional..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>
      <Wrap spacing={2} mb={4}>
        {categories.map((category) => (
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
        {filteredWorkers.map((worker, index) => (
          <WorkerCard
            key={worker.firstName + index} //here should go the id
            profilePicture={worker.profilePicture}
            rating={worker.rating}
            firstName={worker.firstName}
            lastName={worker.lastName}
            profession={worker.profession}
            description={worker.description}
            location={worker.location}
          />
        ))}
      </Grid>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        HOME FOOTER
      </footer>
    </div>
  );
}
