/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'xefsjwahbvrgjqysodbm.supabase.co'
    ],
  },
}

module.exports = nextConfig
