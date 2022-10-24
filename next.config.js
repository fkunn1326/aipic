/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
      'xefsjwahbvrgjqysodbm.supabase.co'
    ],
  },
}

module.exports = nextConfig
