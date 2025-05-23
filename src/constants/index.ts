import { Category } from '@/types/onboarding';

// Departaments from the province of San Juan
export const sanJuanDepartments: string[] = [
  'Albardón',
  'Angaco',
  'Calingasta',
  'Capital',
  'Caucete',
  'Chimbas',
  'Gran San Juan',
  'Iglesia',
  'Jáchal',
  '9 de Julio',
  'Pocito',
  'Rawson',
  'Rivadavia',
  'San Martín',
  'Santa Lucía',
  'Sarmiento',
  'Ullum',
  'Valle Fértil',
  '25 de Mayo',
  'Zonda',
];

// Work categories
export const categories: Category[] = [
  { label: 'Albañilería', value: 'masonry' },
  { label: 'Plomería', value: 'plumbing' },
  { label: 'Pintura', value: 'painting' },
  { label: 'Carpintería', value: 'carpentry' },
  { label: 'Herrería', value: 'blacksmithing' },
  { label: 'Electricidad', value: 'electricity' },
  { label: 'Otros', value: 'others' },
];

export const OPPORTUNITY_TYPES = [
  { label: 'Rápido / casual', value: 'quick' },
  { label: 'Varios días', value: 'days' },
  { label: 'Varias semanas', value: 'weeks' },
  { label: 'Oferta de trabajo permanente', value: 'permanent' },
];
