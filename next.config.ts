import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@node-rs/argon2'],
  devIndicators: false,
};

export default nextConfig;
