import { categories } from '@/constants';

export const getProfessionLabel = (professions: string[]) => {
  const labels = professions.map((profession) => {
    const category = categories.find(
      (category) => category.value === profession,
    );
    return category ? category.label : 'Otro';
  });

  return labels.join(', ');
};
