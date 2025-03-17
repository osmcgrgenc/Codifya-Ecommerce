if (!self.define) {
  let e,
    s = {};
  const n = (n, a) => (
    (n = new URL(n + '.js', a).href),
    s[n] ||
      new Promise(s => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = n), (e.onload = s), document.head.appendChild(e);
        } else (e = n), importScripts(n), s();
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, i) => {
    const c = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[c]) return;
    let t = {};
    const f = e => n(e, c),
      d = { module: { uri: c }, exports: t, require: f };
    s[c] = Promise.all(a.map(e => d[e] || f(e))).then(e => (i(...e), t));
  };
}
define(['./workbox-4754cb34'], function (e) {
  'use strict';
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/app-build-manifest.json', revision: 'fe7b8cf0f80dd8779f6861700489c155' },
        { url: '/_next/static/chunks/2117-ba0c02f78915d309.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/2524-c2bc3feacf684e26.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/2972-9e08ae2092431f7b.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/3340-50355dccb2e069c5.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/4438-d1cd0f319520497f.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/4863-04bbd8b2b253ecb9.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/5065-2027c531fe850ae6.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/5674-9c90d2cdd4d4d1e8.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/5878-542d9af42855b74f.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/6033-bcc88e72f6e7dbb7.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/6137-9c0153edf0d3adb1.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/641-914479fe2c530894.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/6663-bff6bbd02f510b74.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/6728-2133539ad1b8f398.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/697-462e5be30ae9f84c.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/7650-8cdbb7937b8cf590.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/9446-dfb58978d079c8fb.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        { url: '/_next/static/chunks/9809-d29e01915d27688e.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        {
          url: '/_next/static/chunks/app/_not-found/page-52b394ee17aadaa6.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/about/page-270251679367f5d0.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/blogs/%5Bid%5D/delete/page-4cef14ff1f483c70.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/blogs/%5Bid%5D/page-1d2519ed69e9e3a2.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/blogs/%5Bid%5D/publish/page-441518b2a8e8fa68.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/blogs/%5Bid%5D/unpublish/page-812504415a17b973.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/blogs/categories/%5Bid%5D/delete/page-59827ace88235766.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/blogs/categories/%5Bid%5D/page-a39a3d7e9f00a62d.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/blogs/categories/new/page-874d398730a52ea5.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/blogs/categories/page-2f538e62fa97dcb1.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/blogs/new/page-766b0a8a12918e74.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/blogs/page-bc8fb8c8af47c125.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/contact/%5Bid%5D/page-4302701df423d2c4.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/contact/page-077eaba92ec0d25e.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/import/page-cbdcedaac2af76b7.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/layout-482a746163f7e3be.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/orders/%5Bid%5D/page-ff28d59fd1306331.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/orders/page-9f8c4d08eb711c0a.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/page-b09d3ddb9fb9c484.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/products/%5Bid%5D/page-d8865ccf27b31dfc.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/products/page-6da9dec465fdd3d6.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/settings/page-d9618c9ce328a478.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/users/%5Bid%5D/page-43e0437f029bc920.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/admin/users/page-8c9d34b2f6dc2b12.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/auth/login/page-ede60668a3586736.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/auth/register/page-6074253e06dbd080.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/cart/page-ed3aa63e778f918c.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/checkout/page-da6cad2b57197b7e.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/contact/page-5e9968f9fba3b5a3.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/layout-222580b59b9f7f74.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/offline/page-83205c83ec4ce92c.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/orders/%5Bid%5D/page-5cd33d5a8e1fb304.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/orders/bank-transfer/page-df7ac3f6cd1476d4.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/orders/failed/page-aa1e77b3c1a9da20.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/orders/page-262cd33e5fec77fd.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/orders/success/page-ec0fee79def55fa0.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/page-92a39e14621dd7a7.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/profile/page-63dee99caf0a7fac.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/search/page-544c99aa4c326c66.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/shop/category/%5Bslug%5D/page-b570b649fb219653.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/shop/page-0b422d82368c7e90.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/app/shop/product/%5Bid%5D/page-2eca13842d65c63e.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/fd9d1056-7fcc4424d12a9807.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/framework-a63c59c368572696.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        { url: '/_next/static/chunks/main-8474ff989324f314.js', revision: 'dh_nfmfQTE1YYV0u1NU2P' },
        {
          url: '/_next/static/chunks/main-app-2bdfa713052951ac.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/pages/_app-78ddf957b9a9b996.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/pages/_error-7ce03bcf1df914ce.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-187e0374266466f6.js',
          revision: 'dh_nfmfQTE1YYV0u1NU2P',
        },
        { url: '/_next/static/css/088a603065731057.css', revision: '088a603065731057' },
        {
          url: '/_next/static/dh_nfmfQTE1YYV0u1NU2P/_buildManifest.js',
          revision: '0ea7e7088aabf697ba3d8aa8c7b54a89',
        },
        {
          url: '/_next/static/dh_nfmfQTE1YYV0u1NU2P/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/media/26a46d62cd723877-s.woff2',
          revision: 'befd9c0fdfa3d8a645d5f95717ed6420',
        },
        {
          url: '/_next/static/media/55c55f0601d81cf3-s.woff2',
          revision: '43828e14271c77b87e3ed582dbff9f74',
        },
        {
          url: '/_next/static/media/581909926a08bbc8-s.woff2',
          revision: 'f0b86e7c24f455280b8df606b89af891',
        },
        {
          url: '/_next/static/media/6d93bde91c0c2823-s.woff2',
          revision: '621a07228c8ccbfd647918f1021b4868',
        },
        {
          url: '/_next/static/media/97e0cb1ae144a2a9-s.woff2',
          revision: 'e360c61c5bd8d90639fd4503c829c2dc',
        },
        {
          url: '/_next/static/media/a34f9d1faa5f3315-s.p.woff2',
          revision: 'd4fe31e6a2aebc06b8d6e558c9141119',
        },
        {
          url: '/_next/static/media/df0a9ae256c0569c-s.woff2',
          revision: 'd54db44de5ccb18886ece2fda72bdfe0',
        },
        { url: '/apple-touch-icon.png', revision: '772a67da1d5d290999229769677c29d7' },
        { url: '/favicon.ico', revision: '9b3d740fc36e8502cddaa03e0360eff6' },
        { url: '/icon-192x192.png', revision: 'f3c284a7d56748d368dedc46b59ca7f8' },
        { url: '/icon-512x512.png', revision: 'b5c6b44d370de2c39e4ae417ffcf83c3' },
        { url: '/icon.svg', revision: '0a562de6252acf16586f50ba47377044' },
        { url: '/icons/apple-icon-180x180.png', revision: '7215ee9c7d9dc229d2921a40e899ec5f' },
        { url: '/icons/icon-192x192.png', revision: '7215ee9c7d9dc229d2921a40e899ec5f' },
        { url: '/icons/icon-512x512.png', revision: '7215ee9c7d9dc229d2921a40e899ec5f' },
        { url: '/images/amex.svg', revision: '123e4e8b1a17f3413871cb4db93f5992' },
        { url: '/images/categories/clothing.jpg', revision: 'ba05ec3456ef2df2becf8bf9a3fb7766' },
        { url: '/images/categories/computers.jpg', revision: 'f9988e7f3320e06cbda6716abde71d69' },
        { url: '/images/categories/electronics.jpg', revision: 'f9988e7f3320e06cbda6716abde71d69' },
        { url: '/images/categories/phones.jpg', revision: 'f9988e7f3320e06cbda6716abde71d69' },
        { url: '/images/categories/sports.jpg', revision: '8868b10821c7d0cd3ef88e1561e2f013' },
        { url: '/images/hero-image.jpg', revision: '7cb48487e9c4b5ad63093e6a0fed3f69' },
        { url: '/images/mastercard.svg', revision: 'e59dfbaad56f46d2ecc7f1b5627c93cf' },
        { url: '/images/og-image.jpg', revision: '2117a35e7d22f674e1b165f93550e154' },
        { url: '/images/placeholder.jpg', revision: 'ff05c32b95c4662d6a354996438a3937' },
        { url: '/images/products/dress.jpg', revision: 'db59e8d435190e39f9dc258e5a1b755a' },
        { url: '/images/products/headphones.jpg', revision: '5fef0eb67a4e112a5c0eb4fd17cd11a2' },
        { url: '/images/products/laptop.jpg', revision: '20ea6847e90eaebf16972b5615925db8' },
        { url: '/images/products/shoes.jpg', revision: '78193a6e299259fddd1f778c1f26b6c8' },
        { url: '/images/products/smartphone.jpg', revision: '2a29d86da2758e543338331c9597759a' },
        { url: '/images/products/tshirt.jpg', revision: '9910c1213c580da70277e29c844c8c7e' },
        { url: '/images/team/ceo.jpg', revision: 'ff05c32b95c4662d6a354996438a3937' },
        { url: '/images/team/cmo.jpg', revision: 'ff05c32b95c4662d6a354996438a3937' },
        { url: '/images/team/cto.jpg', revision: 'ff05c32b95c4662d6a354996438a3937' },
        { url: '/images/twitter-image.jpg', revision: '2117a35e7d22f674e1b165f93550e154' },
        { url: '/images/visa.svg', revision: '0b6c5bdc2aa7a7dadfcd0c4a796e5fb2' },
        { url: '/manifest.json', revision: '5834d68d2a85c450f149a17123f28092' },
        { url: '/robots.txt', revision: '0d3ef0ba19c0e26349e1e7852dd764dd' },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: s, event: n, state: a }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, { status: 200, statusText: 'OK', headers: s.headers })
                : s,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      'GET'
    );
});
