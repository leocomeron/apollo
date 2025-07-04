import { categories, OPPORTUNITY_TYPES } from '@/constants';

/**
 * Decodes a category value to its Spanish label
 * @param value - The category value (e.g., 'masonry', 'plumbing')
 * @returns The Spanish category label (e.g., 'Albañilería', 'Plomería')
 */
export const decodeCategory = (value: string): string => {
  const category = categories.find((cat) => cat.value === value);
  return category?.label || value;
};

/**
 * Decodes multiple category values to their Spanish labels
 * @param values - Array of category values
 * @returns Array of Spanish category labels
 */
export const decodeCategories = (values: string[]): string[] => {
  return values.map((value) => decodeCategory(value));
};

/**
 * Decodes an opportunity type value to its Spanish label
 * @param value - The opportunity type value (e.g., 'quick', 'days')
 * @returns The Spanish opportunity type label (e.g., 'Rápido / casual', 'Varios días')
 */
export const decodeOpportunityType = (value: string): string => {
  const opportunityType = OPPORTUNITY_TYPES.find(
    (type) => type.value === value,
  );
  return opportunityType?.label || value;
};
