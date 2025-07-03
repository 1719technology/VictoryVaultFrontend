/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

// Derive __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack(config) {
    // Ensure @radix-ui/react-primitive can resolve react-slot
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@radix-ui/react-slot': path.resolve(__dirname, 'node_modules/@radix-ui/react-slot'),
    };
    return config;
  },
};

export default nextConfig;
