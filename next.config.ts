import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "*.supabase.co",
  //       pathname: "/storage/v1/object/public/**",
  //     },
  //   ],
  // },
  images: {
    unoptimized: true, // ← esto desactiva la optimización de imágenes
  },
  // Temporal: noindex en todas las respuestas (también rss.xml, imágenes, etc.)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default nextConfig;
