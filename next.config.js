/** @type {import('next').NextConfig} */

const withPlugins = require("next-compose-plugins");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});
const withTM = require("next-transpile-modules")([
  "react-tag-input",
  "react-dnd",
  "dnd-core",
  "@react-dnd/invariant",
  "@react-dnd/asap",
  "@react-dnd/shallowequal",
]);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const { EnvironmentPlugin } = require('webpack');

module.exports = withPlugins([withTM, withPWA, withBundleAnalyzer], {
  // i18n: {
  //   defaultLocale: "ja",
  //   locales: ["ja", "en", "zh"],
  //   localeDetection: true,
  // },
  experimental: {
    esmExternals: "loose",
    scrollRestoration: true,
    nextScriptWorkers: true,
    runtime: 'experimental-edge',
  },
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
      "xefsjwahbvrgjqysodbm.supabase.co",
      "lh3.googleusercontent.com",
      "pub-25066e52684e449b90f5170d93e6c396.r2.dev",
      "media.discordapp.net",
      "imagedelivery.net",
    ],
  },
  webpack(config) {
    config.plugins.push(
      new EnvironmentPlugin(
        [
          'BASE_URL',
          'CLOUDFLARE_IMAGES_ACCOUNT_ID',
          'CLOUDFLARE_IMAGES_API_TOKEN',
          'CLOUDFLARE_R2_ACCESS_KEY',
          'CLOUDFLARE_R2_ACCOUNT_ID',
          'CLOUDFLARE_R2_BUCKET_NAME',
          'CLOUDFLARE_R2_SECRET_KEY',
          'NEXT_PUBLIC_GA_TRACKING_ID',
          'NEXT_PUBLIC_MAINTENANCE_MODE',
          'NEXT_PUBLIC_SUPABASE_ANON_KEY',
          'NEXT_PUBLIC_SUPABASE_URL',
          'SUPABASE_SERVICE_ROLE_KEY'
        ]
      )
    );

    return config;
  },
  async redirects() {
    return [
      {
        source: "/images/:id*",
        destination: "/artworks/:id*",
        permanent: false,
      },
    ];
  },
});
