import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Environment variables available in the browser
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  
  // Enable experimental features if needed
  experimental: {
    // Future features can be enabled here
  },
};

export default nextConfig;

