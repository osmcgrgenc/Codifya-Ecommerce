import '@/app/globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Providers } from '../../providers';
import { ToastProvider } from '@/components/ui/use-toast';
import { getTranslations } from 'next-intl/server';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codifya-ecommerce.com';
const siteName = process.env.APP_NAME || 'E-Ticaret';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#4f46e5',
};

export const metadata: Metadata = {
  title: siteName,
  description:
    'Modern ve kullanıcı dostu bir e-ticaret platformu. En yeni ürünler ve kampanyalar için hemen alışverişe başlayın.',
  keywords: 'e-ticaret, online alışveriş, moda, elektronik, indirim, kampanya',
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
    languages: {
      'tr-TR': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: siteName,
    description:
      'Modern ve kullanıcı dostu bir e-ticaret platformu. En yeni ürünler ve kampanyalar için hemen alışverişe başlayın.',
    url: siteUrl,
    siteName: siteName,
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description:
      'Modern ve kullanıcı dostu bir e-ticaret platformu. En yeni ürünler ve kampanyalar için hemen alışverişe başlayın.',
    images: ['/images/twitter-image.jpg'],
    creator: '@codifya',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: siteName,
  },
  applicationName: siteName,
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png' },
      { url: '/icons/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = (await import(`../../../../messages/${locale}/index.json`)).default;

  return (
    <html lang={locale}>
      <head>
        {/* Preload kritik kaynaklar */}
        <link rel="preload" href="/images/hero-image.jpg" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* PWA için ek meta etiketleri */}
        <meta name="application-name" content={siteName} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={siteName} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#4f46e5" />

        {/* PWA için manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-icon-180x180.png" />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <Providers messages={messages} locale={locale}>
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </Providers>
        </ToastProvider>
      </body>
    </html>
  );
}
