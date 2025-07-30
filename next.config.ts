import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'avatars.githubusercontent.com',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],

    // 또는
    remotePatterns: [],
    domains: ['*'], 
  },
};

export default nextConfig;
