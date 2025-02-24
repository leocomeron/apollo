const getRequiredEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  mongodb: {
    uri: getRequiredEnvVar('MONGODB_URI'),
  },
  nextAuth: {
    secret: getRequiredEnvVar('NEXTAUTH_SECRET'),
    url: getRequiredEnvVar('NEXTAUTH_URL'),
  },
  google: {
    clientId: getRequiredEnvVar('GOOGLE_CLIENT_ID'),
    clientSecret: getRequiredEnvVar('GOOGLE_CLIENT_SECRET'),
  },
  cloudinary: {
    cloudName: getRequiredEnvVar('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'),
    apiKey: getRequiredEnvVar('NEXT_PUBLIC_CLOUDINARY_API_KEY'),
    apiSecret: getRequiredEnvVar('NEXT_PUBLIC_CLOUDINARY_API_SECRET'),
    uploadPreset: getRequiredEnvVar('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'),
  },
} as const;

export type Env = typeof env;
