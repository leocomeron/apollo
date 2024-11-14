import Menu from '@/components/Menu';
import WorkerCard from '@/components/WorkerCard';
import { workerCardMock } from '@/mocks/workerCard';
import { Grid } from '@chakra-ui/react';

export default function Home() {
  return (
    <div
      className={
        'grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-2 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'
      }
    >
      <Menu />
      <main>MAIN</main>
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        gap={4}
      >
        {workerCardMock.map((worker, index) => (
          <WorkerCard
            key={index}
            profilePicture={worker.profilePicture}
            rating={worker.rating}
            firstName={worker.firstName}
            lastName={worker.lastName}
            profession={worker.profession}
            description={worker.description}
          />
        ))}
      </Grid>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        HOME FOOTER
      </footer>
    </div>
  );
}
