if (!self.define) {
  let e,
    s = {};
  const a = (a, i) => (
    (a = new URL(a + '.js', i).href),
    s[a] ||
      new Promise(s => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, c) => {
    const n = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[n]) return;
    let t = {};
    const d = e => a(e, n),
      r = { module: { uri: n }, exports: t, require: d };
    s[n] = Promise.all(i.map(e => r[e] || d(e))).then(e => (c(...e), t));
  };
}
define(['./workbox-4754cb34'], function (e) {
  'use strict';
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/app-build-manifest.json', revision: '9144521d60981b0c10f220c481c45ccd' },
        { url: '/_next/static/chunks/2117-ba0c02f78915d309.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/2524-d74f7e924efaa76a.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/2878-652b00704fd19ae6.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/2972-788eb5d165cb3f88.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/3340-50355dccb2e069c5.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/4438-d1cd0f319520497f.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/4994-85732314120a0f06.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/5065-2027c531fe850ae6.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/5674-9c90d2cdd4d4d1e8.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/5878-542d9af42855b74f.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/6033-bcc88e72f6e7dbb7.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/6137-9c0153edf0d3adb1.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/641-db1518b816a1dd26.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/6663-bff6bbd02f510b74.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/6728-65bd054d48afeb24.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/697-9a2a9fe5f394b664.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/7472-00b1d804bc69c7a6.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/7650-8cdbb7937b8cf590.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        { url: '/_next/static/chunks/9809-ba85adbc160fa27f.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/blogs/%5Bid%5D/delete/page-9a4de6db41595cfc.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/blogs/%5Bid%5D/page-9fa64741423acff5.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/blogs/%5Bid%5D/publish/page-7e19d3e5c2147018.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/blogs/%5Bid%5D/unpublish/page-2de1533f9f2c73d8.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/blogs/categories/%5Bid%5D/delete/page-ab58116a00e44a19.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/blogs/categories/%5Bid%5D/page-146c9f5bdbb2e1d2.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/blogs/categories/new/page-0f47f99739809c9f.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/blogs/categories/page-4a37af5a3f07741d.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/blogs/new/page-cae926f5cb24f666.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/blogs/page-6bd13fc0144fb1fa.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/contact/%5Bid%5D/page-8f03e4c1dbbee3aa.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/contact/page-fef6b84593506287.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/import/page-371dd5989e185e2f.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/layout-6cf1d4240f9b6ed5.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/orders/%5Bid%5D/page-0e2856edbda10bc5.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/orders/page-13353031a4344b91.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/page-2b2ab0b92b88dfec.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/products/%5Bid%5D/page-4bf1f1241050bb08.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/products/page-c849385902796b4f.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/settings/page-5117bbae4262feb2.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/users/%5Bid%5D/page-b91058ef1c4694a2.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(admin)/admin/users/page-8c6a10e411a3ef21.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/about/page-49bb1b3af5605627.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/auth/login/page-0540c4297e5325ce.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/auth/register/page-a2fe6823a1edf102.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/cart/page-232995521c6ff618.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/checkout/page-fc8621e00c7dc4e0.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/contact/page-518148e8546c7d40.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/layout-b57d530218f2fa79.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/offline/page-83c29ae6de1b7cb1.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/orders/%5Bid%5D/page-eed8fdecd602869d.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/orders/bank-transfer/page-64f80afa633601fe.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/orders/failed/page-aa5ce89a8f6f8dda.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/orders/page-f292e2180373b31d.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/orders/success/page-a55773c65ec24c2f.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/page-84c14801a78678fa.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/profile/page-b7f12e26cfc1bbc7.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/search/page-ac06659e0be4e3aa.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/shop/category/%5Bslug%5D/page-ff699ed41fb1a397.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/shop/page-5bf4d47e843b5c97.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/(shop)/shop/product/%5Bid%5D/page-21485a85593afaf4.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-52b394ee17aadaa6.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/fd9d1056-7fcc4424d12a9807.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/framework-a63c59c368572696.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/main-app-2bdfa713052951ac.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        { url: '/_next/static/chunks/main-e919a5c08189124b.js', revision: 'dlPTpNBZTOMDCD4SBujvb' },
        {
          url: '/_next/static/chunks/pages/_app-78ddf957b9a9b996.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/pages/_error-7ce03bcf1df914ce.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-20f487bdd4008274.js',
          revision: 'dlPTpNBZTOMDCD4SBujvb',
        },
        { url: '/_next/static/css/088a603065731057.css', revision: '088a603065731057' },
        {
          url: '/_next/static/dlPTpNBZTOMDCD4SBujvb/_buildManifest.js',
          revision: '0ea7e7088aabf697ba3d8aa8c7b54a89',
        },
        {
          url: '/_next/static/dlPTpNBZTOMDCD4SBujvb/_ssgManifest.js',
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
            cacheWillUpdate: async ({ request: e, response: s, event: a, state: i }) =>
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
