/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'alser-argentina.com.ar', // remove when use real data
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com', // remove when use real data
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
