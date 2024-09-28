/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.NODE_ENV === 'production'
      ? process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-domain.com'
      : 'http://localhost:3000',
  },
  // Enable static exports for ISR
  output: 'standalone',
};

export default nextConfig;
