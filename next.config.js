/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  "react-tag-input",
  "react-dnd",
  "dnd-core",
  "@react-dnd/invariant",
  "@react-dnd/asap",
  "@react-dnd/shallowequal",
])


module.exports = withTM({
  experimental: { esmExternals: "loose" },
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
