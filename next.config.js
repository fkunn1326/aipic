/** @type {import('next').NextConfig} */

const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa')({
  dest: 'public',    
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})
const withTM = require("next-transpile-modules")([
  "react-tag-input",
  "react-dnd",
  "dnd-core",
  "@react-dnd/invariant",
  "@react-dnd/asap",
  "@react-dnd/shallowequal",
])


module.exports = withPlugins([withTM, withPWA], {
  reactStrinctMode: true,
  experimental: { 
    esmExternals: "loose",
    scrollRestoration: true,
  },
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
      "xefsjwahbvrgjqysodbm.supabase.co", 
      "lh3.googleusercontent.com",
      "pub-25066e52684e449b90f5170d93e6c396.r2.dev"
    ],
  },
});
