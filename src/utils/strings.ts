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

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-zA-Z]).{8,}$/;
  return passwordRegex.test(password);
};
