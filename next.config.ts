import type { NextConfig } from "next";

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
};

export default nextConfig;
