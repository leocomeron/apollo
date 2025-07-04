import WorkerCard from '@/components/WorkerCard';
import { User } from '@/pages/api/users/types';
import { Category } from '@/types/onboarding';
import { decodeCategories } from '@/utils/decoders';
import { getProfilePictureUrl } from '@/utils/user';
import { Box, Grid, Input, Stack, Tag, Wrap, WrapItem } from '@chakra-ui/react';
import { useState } from 'react';

interface WorkersSectionProps {
  workers: User[];
  categories: Category[];
}

export default function WorkersSection({
  workers,
  categories,
}: WorkersSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
    <Stack spacing={6}>
      <Box width="100%" maxW="600px">
        <Input
          placeholder="Busca tu profesional..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>

      <Wrap spacing={2}>
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
            professions={decodeCategories(worker.categories ?? [])}
            description={worker?.description ?? ''}
            location={worker.contact.location}
          />
        ))}
      </Grid>
    </Stack>
  );
}
