/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: { styledComponents: true },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
