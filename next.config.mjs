/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed "output: export" to enable API routes
  // API routes require server-side rendering
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
