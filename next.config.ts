import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'crests.football-data.org',
        pathname: '/**',
      },
    ]
  },
   typescript: {
    ignoreBuildErrors: true,
  },
  
};

export default nextConfig;
