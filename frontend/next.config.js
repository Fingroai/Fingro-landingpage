/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  typescript: {
    // ⚠️ Ignorar errores de TypeScript durante la compilación
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Ignorar errores de ESLint durante la compilación
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
