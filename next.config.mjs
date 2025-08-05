import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  webpack(config) {
    // Fix alias only
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@radix-ui/react-slot': path.resolve(__dirname, 'node_modules/@radix-ui/react-slot'),
    };

    // Ignore lucide-react route.js file
    config.module.rules.push({
      test: /node_modules[\\/]lucide-react[\\/]dist[\\/]esm[\\/]icons[\\/]route\.js$/,
      use: 'null-loader'
    });

    return config;
  },
};

export default nextConfig;
