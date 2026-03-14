/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['fonts.gstatic.com'],
  },
  experimental: {
    optimizePackageImports: ['recharts', 'echarts'],
  },
}

module.exports = nextConfig
