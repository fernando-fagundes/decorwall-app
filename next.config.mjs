/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fotomural.com.br",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "863c7441b944411b744b3e4d037f100f.cdn.bubble.io",
      },
    ],
  },
};

export default nextConfig;
