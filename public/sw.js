if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,n)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let t={};const r=e=>c(e,i),o={module:{uri:i},exports:t,require:r};s[i]=Promise.all(a.map((e=>o[e]||r(e)))).then((e=>(n(...e),t)))}}define(["./workbox-588899ac"],(function(e){"use strict";importScripts("worker-4ObuAPPNOox8NpQfAzY3R.js"),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/4ObuAPPNOox8NpQfAzY3R/_buildManifest.js",revision:"99522a512eec9016a47b1edc017932a9"},{url:"/_next/static/4ObuAPPNOox8NpQfAzY3R/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/196-b484fb930da728b6.js",revision:"b484fb930da728b6"},{url:"/_next/static/chunks/218-8b9ef62b658ac9f6.js",revision:"8b9ef62b658ac9f6"},{url:"/_next/static/chunks/2cca2479-3d200a806ce08d67.js",revision:"3d200a806ce08d67"},{url:"/_next/static/chunks/361-11424d170bf4c2cb.js",revision:"11424d170bf4c2cb"},{url:"/_next/static/chunks/420-ca5ee0ed13d9412c.js",revision:"ca5ee0ed13d9412c"},{url:"/_next/static/chunks/512-16ea64f4cfee7428.js",revision:"16ea64f4cfee7428"},{url:"/_next/static/chunks/675-1eac875c5cfbe5d0.js",revision:"1eac875c5cfbe5d0"},{url:"/_next/static/chunks/852-23baa0da42b348c4.js",revision:"23baa0da42b348c4"},{url:"/_next/static/chunks/896-ba9e5526021d3515.js",revision:"ba9e5526021d3515"},{url:"/_next/static/chunks/be3c5fc3-381d871dee5b5b78.js",revision:"381d871dee5b5b78"},{url:"/_next/static/chunks/d59bccd2.74aee3de19a0385e.js",revision:"74aee3de19a0385e"},{url:"/_next/static/chunks/framework-7751730b10fa0f74.js",revision:"7751730b10fa0f74"},{url:"/_next/static/chunks/main-eb84c70527e825c8.js",revision:"eb84c70527e825c8"},{url:"/_next/static/chunks/pages/_app-e12cd2fb969640e1.js",revision:"e12cd2fb969640e1"},{url:"/_next/static/chunks/pages/_error-e4f561a102d9bb14.js",revision:"e4f561a102d9bb14"},{url:"/_next/static/chunks/pages/artworks/%5Bid%5D-2692194dbe4bed8a.js",revision:"2692194dbe4bed8a"},{url:"/_next/static/chunks/pages/auth-58fb78c5e2865e99.js",revision:"58fb78c5e2865e99"},{url:"/_next/static/chunks/pages/daily_ranking-1bcabb24fdbef402.js",revision:"1bcabb24fdbef402"},{url:"/_next/static/chunks/pages/dashboard-45ac19e1b7446392.js",revision:"45ac19e1b7446392"},{url:"/_next/static/chunks/pages/edit/%5Bid%5D-eb0b839c5f80cf34.js",revision:"eb0b839c5f80cf34"},{url:"/_next/static/chunks/pages/history-317c6a50672ab125.js",revision:"317c6a50672ab125"},{url:"/_next/static/chunks/pages/index-3f245a4e03f9c31c.js",revision:"3f245a4e03f9c31c"},{url:"/_next/static/chunks/pages/likes-7a6529193d45a81c.js",revision:"7a6529193d45a81c"},{url:"/_next/static/chunks/pages/maintenance-49bfb2d5bd701412.js",revision:"49bfb2d5bd701412"},{url:"/_next/static/chunks/pages/negative/%5Bprompt%5D-6b2e18802faa5ed9.js",revision:"6b2e18802faa5ed9"},{url:"/_next/static/chunks/pages/new-341887f4a6882320.js",revision:"341887f4a6882320"},{url:"/_next/static/chunks/pages/prompts/%5Bprompt%5D-7e53fb4c7fa8aece.js",revision:"7e53fb4c7fa8aece"},{url:"/_next/static/chunks/pages/search/%5Bkeyword%5D-2a470e4761984eef.js",revision:"2a470e4761984eef"},{url:"/_next/static/chunks/pages/settings-740b0a83fa4219dc.js",revision:"740b0a83fa4219dc"},{url:"/_next/static/chunks/pages/signin-9861c104b58d01a2.js",revision:"9861c104b58d01a2"},{url:"/_next/static/chunks/pages/signup-54249d554e91c970.js",revision:"54249d554e91c970"},{url:"/_next/static/chunks/pages/special/aipic_release-79b5e46717cb4ef4.js",revision:"79b5e46717cb4ef4"},{url:"/_next/static/chunks/pages/tags/%5Btag%5D-bd49fd138c5b1e9e.js",revision:"bd49fd138c5b1e9e"},{url:"/_next/static/chunks/pages/terms/guideline-c62502d1ca6b4dce.js",revision:"c62502d1ca6b4dce"},{url:"/_next/static/chunks/pages/terms/privacy_policy-3648edb86376d656.js",revision:"3648edb86376d656"},{url:"/_next/static/chunks/pages/terms/tos-14556faa8183d397.js",revision:"14556faa8183d397"},{url:"/_next/static/chunks/pages/upload-74959aa3f02bc10c.js",revision:"74959aa3f02bc10c"},{url:"/_next/static/chunks/pages/users/%5Bid%5D-4cb8ad5941798162.js",revision:"4cb8ad5941798162"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-fa150b457cc7829c.js",revision:"fa150b457cc7829c"},{url:"/_next/static/css/8df27cffae2584d2.css",revision:"8df27cffae2584d2"},{url:"/_next/static/css/caea31c2e89f7cd6.css",revision:"caea31c2e89f7cd6"},{url:"/favicon.ico",revision:"3b302db6615e8cf995ae5d142083c48c"},{url:"/favicon.png",revision:"f942d4d8158442649b84bee47daf6b89"},{url:"/images/icons/icon-128x128.png",revision:"5adbad293058ecc2847995cbeef7eb7b"},{url:"/images/icons/icon-144x144.png",revision:"3d585f1751bd5814ed62acf8f22034c8"},{url:"/images/icons/icon-152x152.png",revision:"422d0fb5abd4822f1dc5dff09cb0e378"},{url:"/images/icons/icon-192x192.png",revision:"266598e833f120388db2e4244cfa67d9"},{url:"/images/icons/icon-384x384.png",revision:"594f38308c2314ff9c5589e22b83e464"},{url:"/images/icons/icon-512x512.png",revision:"85780cbae5f009aebd4af5199ecca89d"},{url:"/images/icons/icon-72x72.png",revision:"a59f94dde81fa72f32a574c06493c4c0"},{url:"/images/icons/icon-96x96.png",revision:"20aaf5534748fd31d583e8a7aaaa0082"},{url:"/locales/en/common.json",revision:"5a47a50e5fb21985908634cf073ef8af"},{url:"/locales/ja/common.json",revision:"9249cb1e4926732e57597d40fb0835c8"},{url:"/locales/zh/common.json",revision:"5a47a50e5fb21985908634cf073ef8af"},{url:"/manifest.json",revision:"e01599958da6c0a3cc5917b887baa63c"},{url:"/vercel.svg",revision:"4b4f1876502eb6721764637fe5c41702"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
