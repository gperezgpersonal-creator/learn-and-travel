import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/tec-de-monterrey',
        destination: '/programs/tec-de-monterrey',
        permanent: true,
      },
      {
        source: '/tec-de-monterrey/:slug',
        destination: '/programs/tec-de-monterrey/:slug',
        permanent: true,
      },
      {
        source: '/forms/:programId',
        destination: '/programs/forms/:programId',
        permanent: true,
      },
      {
        source: '/admin/orders',
        destination: '/dashboard/admin/orders',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/dashboard/login',
        permanent: true,
      },
      {
        source: '/intranet',
        destination: '/dashboard/login',
        permanent: true,
      },
      {
        source: '/staff',
        destination: '/dashboard/admin',
        permanent: true,
      },
      {
        source: '/clients',
        destination: '/dashboard/student',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
