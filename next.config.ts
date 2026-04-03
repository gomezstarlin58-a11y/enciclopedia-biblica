/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Salta los errores de TypeScript al subir a Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    // Salta los errores de estilo al subir a Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;