import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qs5zdockmh5ycqic.public.blob.vercel-storage.com',
        port: '',
        search: '',
        pathname: '/assets/**',
      },
    ],
  },
};

export default nextConfig;
