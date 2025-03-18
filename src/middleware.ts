import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Desteklenen diller listesi
  locales: ['en', 'tr'],
  // Varsayılan dil
  defaultLocale: 'tr',
  // Dil bilgisini URL'de gösterme (örn: /tr/products, /en/products)
  localePrefix: 'as-needed',
});

export const config = {
  // Tüm sayfalarda middleware'i çalıştır
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
