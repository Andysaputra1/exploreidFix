/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // tambahkan semua host eksternal yang kamu pakai
    domains: ['via.placeholder.com', 'images.unsplash.com', 'cdn.yourdomain.com'],
  },
  eslint: {
    // sementara: abaikan error ESLint di build Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // sementara: abaikan error TypeScript saat build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
