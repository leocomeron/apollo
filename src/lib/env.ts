const getRequiredEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  app: {
    next_public_api_url: getRequiredEnvVar('NEXT_PUBLIC_API_URL'),
    node_env: getRequiredEnvVar('NODE_ENV'),
  },
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
  brevo: {
    apiKey: getRequiredEnvVar('BREVO_API_KEY'),
    fromEmail: getRequiredEnvVar('BREVO_FROM_EMAIL'),
    fromName: getRequiredEnvVar('BREVO_FROM_NAME'),
  },
} as const;

export type Env = typeof env;
