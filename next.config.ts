import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Every image in this project is a local file under /public/assets, so no
    // remotePatterns are needed. AVIF first, WebP as the fallback.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
