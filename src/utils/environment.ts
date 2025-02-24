export const getEnvironmentVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing ${key} from environment.`);
  }
  return value;
};
