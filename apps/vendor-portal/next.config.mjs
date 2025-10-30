import path from 'node:path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@dumbdee/common-frontend': path.resolve(__dirname, '../../packages/common-frontend/src')
    };
    return config;
  }
};
export default nextConfig;
