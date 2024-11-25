import Menu from '@/components/Menu';
import WorkerCard from '@/components/WorkerCard';
import { workerCardMock } from '@/mocks/workerCard';
import { Box, Grid, Input } from '@chakra-ui/react';
import { useState } from 'react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredWorkers = workerCardMock.filter((worker) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      worker.firstName.toLowerCase().includes(searchLower) ||
      worker.lastName.toLowerCase().includes(searchLower) ||
      worker.profession.toLowerCase().includes(searchLower) ||
      worker.description.toLowerCase().includes(searchLower) ||
      worker.location.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div
      className={
        'grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-2 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]'
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
            key={index}
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
