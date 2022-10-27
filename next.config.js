/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
      'xefsjwahbvrgjqysodbm.supabase.co',
      'lh3.googleusercontent.com'
    ],
  },
}

module.exports = nextConfig
