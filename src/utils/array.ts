import { categories } from '@/constants';

/**
 * Converts an array of category values into their corresponding labels.
 *
 * @param {string[]} activityValues - Array of activity values (e.g., ['masonry', 'electricity']).
 * @returns {string[]} - Array of corresponding activity labels (e.g., ['Albañilería', 'Electricidad']).
 *                        If a value doesn't have a matching category, the original value is returned.
 */
export const getCategoryLabels = (activityValues: string[]): string[] => {
  return activityValues.map((value) => {
    const category = categories.find((cat) => cat.value === value);
    return category ? category.label : value;
  });
};
