
import type {NextConfig} from 'next';
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: false, // Always enable PWA
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
   env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.GEMINI_API_KEY,
  },
  experimental: {
    // This is required to allow the Next.js dev server to accept requests from
    // the Firebase Studio development environment.
    allowedDevOrigins: ["*.cloudworkstations.dev"],
  },
};

export default withPWA(nextConfig);
