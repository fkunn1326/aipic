if (!self.define) {
  let e,
    s = {};
  const c = (c, a) => (
    (c = new URL(c + ".js", a).href),
    s[c] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = c), (e.onload = s), document.head.appendChild(e);
        } else (e = c), importScripts(c), s();
      }).then(() => {
        let e = s[c];
        if (!e) throw new Error(`Module ${c} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, n) => {
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    let t = {};
    const r = (e) => c(e, i),
      o = { module: { uri: i }, exports: t, require: r };
    s[i] = Promise.all(a.map((e) => o[e] || r(e))).then((e) => (n(...e), t));
  };
}
define(["./workbox-588899ac"], function (e) {
  "use strict";
  importScripts("worker-lTtPVw9l0XQWImUgfKe2_.js"),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/chunks/100-92828df925559670.js",
          revision: "92828df925559670",
        },
        {
          url: "/_next/static/chunks/196-5998c641ef23e3cb.js",
          revision: "5998c641ef23e3cb",
        },
        {
          url: "/_next/static/chunks/218-8b9ef62b658ac9f6.js",
          revision: "8b9ef62b658ac9f6",
        },
        {
          url: "/_next/static/chunks/29-a3f8aaeb278d82c9.js",
          revision: "a3f8aaeb278d82c9",
        },
        {
          url: "/_next/static/chunks/2cca2479-3d200a806ce08d67.js",
          revision: "3d200a806ce08d67",
        },
        {
          url: "/_next/static/chunks/512-16ea64f4cfee7428.js",
          revision: "16ea64f4cfee7428",
        },
        {
          url: "/_next/static/chunks/664-b99bf35148ad5304.js",
          revision: "b99bf35148ad5304",
        },
        {
          url: "/_next/static/chunks/675-1eac875c5cfbe5d0.js",
          revision: "1eac875c5cfbe5d0",
        },
        {
          url: "/_next/static/chunks/852-23baa0da42b348c4.js",
          revision: "23baa0da42b348c4",
        },
        {
          url: "/_next/static/chunks/896-f3d5664031f77c82.js",
          revision: "f3d5664031f77c82",
        },
        {
          url: "/_next/static/chunks/98.4da1acf20fafab0c.js",
          revision: "4da1acf20fafab0c",
        },
        {
          url: "/_next/static/chunks/framework-7751730b10fa0f74.js",
          revision: "7751730b10fa0f74",
        },
        {
          url: "/_next/static/chunks/main-eb84c70527e825c8.js",
          revision: "eb84c70527e825c8",
        },
        {
          url: "/_next/static/chunks/pages/_app-5f41394fa046159b.js",
          revision: "5f41394fa046159b",
        },
        {
          url: "/_next/static/chunks/pages/_error-e4f561a102d9bb14.js",
          revision: "e4f561a102d9bb14",
        },
        {
          url: "/_next/static/chunks/pages/artworks/%5Bid%5D-8b7f0bb87407e91a.js",
          revision: "8b7f0bb87407e91a",
        },
        {
          url: "/_next/static/chunks/pages/auth-58fb78c5e2865e99.js",
          revision: "58fb78c5e2865e99",
        },
        {
          url: "/_next/static/chunks/pages/daily_ranking-b9770c47016d7ccc.js",
          revision: "b9770c47016d7ccc",
        },
        {
          url: "/_next/static/chunks/pages/dashboard-0cb92359fdf16397.js",
          revision: "0cb92359fdf16397",
        },
        {
          url: "/_next/static/chunks/pages/edit/%5Bid%5D-f0aaceada4eb1f86.js",
          revision: "f0aaceada4eb1f86",
        },
        {
          url: "/_next/static/chunks/pages/history-65782295179a64d8.js",
          revision: "65782295179a64d8",
        },
        {
          url: "/_next/static/chunks/pages/index-a6788c1ca349601d.js",
          revision: "a6788c1ca349601d",
        },
        {
          url: "/_next/static/chunks/pages/likes-6d25c2066d3dbe62.js",
          revision: "6d25c2066d3dbe62",
        },
        {
          url: "/_next/static/chunks/pages/maintenance-49bfb2d5bd701412.js",
          revision: "49bfb2d5bd701412",
        },
        {
          url: "/_next/static/chunks/pages/negative/%5Bprompt%5D-8f60aeeac6dc17eb.js",
          revision: "8f60aeeac6dc17eb",
        },
        {
          url: "/_next/static/chunks/pages/new-9d4c0668a5c41908.js",
          revision: "9d4c0668a5c41908",
        },
        {
          url: "/_next/static/chunks/pages/prompts/%5Bprompt%5D-6f18d7e941892cc8.js",
          revision: "6f18d7e941892cc8",
        },
        {
          url: "/_next/static/chunks/pages/search/%5Bkeyword%5D-31e5abf84f0f60b2.js",
          revision: "31e5abf84f0f60b2",
        },
        {
          url: "/_next/static/chunks/pages/settings-58f9064f557cd072.js",
          revision: "58f9064f557cd072",
        },
        {
          url: "/_next/static/chunks/pages/signin-8ef0237be13d3e40.js",
          revision: "8ef0237be13d3e40",
        },
        {
          url: "/_next/static/chunks/pages/signup-8381cbf2a55a3887.js",
          revision: "8381cbf2a55a3887",
        },
        {
          url: "/_next/static/chunks/pages/special/aipic_release-e00e6eafc8193492.js",
          revision: "e00e6eafc8193492",
        },
        {
          url: "/_next/static/chunks/pages/tags/%5Btag%5D-f7ebe9fc3d9b15dd.js",
          revision: "f7ebe9fc3d9b15dd",
        },
        {
          url: "/_next/static/chunks/pages/terms/guideline-6e11eaf2f51d38de.js",
          revision: "6e11eaf2f51d38de",
        },
        {
          url: "/_next/static/chunks/pages/terms/privacy_policy-9e764055e2cf2d4b.js",
          revision: "9e764055e2cf2d4b",
        },
        {
          url: "/_next/static/chunks/pages/terms/tos-288dfc3ebfaf6a92.js",
          revision: "288dfc3ebfaf6a92",
        },
        {
          url: "/_next/static/chunks/pages/upload-e5a0f892463e9835.js",
          revision: "e5a0f892463e9835",
        },
        {
          url: "/_next/static/chunks/pages/users/%5Bid%5D-783c24e03c696bd3.js",
          revision: "783c24e03c696bd3",
        },
        {
          url: "/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",
          revision: "837c0df77fd5009c9e46d446188ecfd0",
        },
        {
          url: "/_next/static/chunks/webpack-ec0216c9ebc205ff.js",
          revision: "ec0216c9ebc205ff",
        },
        {
          url: "/_next/static/css/a91893b051daec1f.css",
          revision: "a91893b051daec1f",
        },
        {
          url: "/_next/static/css/caea31c2e89f7cd6.css",
          revision: "caea31c2e89f7cd6",
        },
        {
          url: "/_next/static/lTtPVw9l0XQWImUgfKe2_/_buildManifest.js",
          revision: "58e6dbd8dca8e0eaa91ec63065cf5f5b",
        },
        {
          url: "/_next/static/lTtPVw9l0XQWImUgfKe2_/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        { url: "/favicon.ico", revision: "3b302db6615e8cf995ae5d142083c48c" },
        { url: "/favicon.png", revision: "f942d4d8158442649b84bee47daf6b89" },
        {
          url: "/images/icons/icon-128x128.png",
          revision: "5adbad293058ecc2847995cbeef7eb7b",
        },
        {
          url: "/images/icons/icon-144x144.png",
          revision: "3d585f1751bd5814ed62acf8f22034c8",
        },
        {
          url: "/images/icons/icon-152x152.png",
          revision: "422d0fb5abd4822f1dc5dff09cb0e378",
        },
        {
          url: "/images/icons/icon-192x192.png",
          revision: "266598e833f120388db2e4244cfa67d9",
        },
        {
          url: "/images/icons/icon-384x384.png",
          revision: "594f38308c2314ff9c5589e22b83e464",
        },
        {
          url: "/images/icons/icon-512x512.png",
          revision: "85780cbae5f009aebd4af5199ecca89d",
        },
        {
          url: "/images/icons/icon-72x72.png",
          revision: "a59f94dde81fa72f32a574c06493c4c0",
        },
        {
          url: "/images/icons/icon-96x96.png",
          revision: "20aaf5534748fd31d583e8a7aaaa0082",
        },
        {
          url: "/locales/en/common.json",
          revision: "d41d8cd98f00b204e9800998ecf8427e",
        },
        {
          url: "/locales/en/home.json",
          revision: "8a7e0f3443a6e18967ed0070025adde4",
        },
        {
          url: "/locales/ja/common.json",
          revision: "d41d8cd98f00b204e9800998ecf8427e",
        },
        {
          url: "/locales/ja/home.json",
          revision: "5a47a50e5fb21985908634cf073ef8af",
        },
        {
          url: "/locales/zh/common.json",
          revision: "d41d8cd98f00b204e9800998ecf8427e",
        },
        {
          url: "/locales/zh/home.json",
          revision: "d41d8cd98f00b204e9800998ecf8427e",
        },
        { url: "/manifest.json", revision: "d5397c236f73a86430eeb54c0c01625a" },
        { url: "/vercel.svg", revision: "4b4f1876502eb6721764637fe5c41702" },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: c,
              state: a,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
