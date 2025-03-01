import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Providers } from './providers';
import { ToastProvider } from '@/components/ui/use-toast';

// Font optimizasyonu
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Font yüklenene kadar sistem fontunu göster
  preload: true,
  fallback: ['system-ui', 'sans-serif']
});

export const metadata: Metadata = {
  title: 'Codifya E-Ticaret',
  description: 'Modern ve kullanıcı dostu bir e-ticaret platformu. En yeni ürünler ve kampanyalar için hemen alışverişe başlayın.',
  keywords: 'e-ticaret, online alışveriş, moda, elektronik, indirim, kampanya',
  authors: [{ name: 'Codifya E-Ticaret' }],
  creator: 'Codifya E-Ticaret',
  publisher: 'Codifya E-Ticaret',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://codifya-ecommerce.com'),
  alternates: {
    canonical: '/',
    languages: {
      'tr-TR': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'Codifya E-Ticaret',
    description: 'Modern ve kullanıcı dostu bir e-ticaret platformu. En yeni ürünler ve kampanyalar için hemen alışverişe başlayın.',
    url: 'https://codifya-ecommerce.com',
    siteName: 'Codifya E-Ticaret',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Codifya E-Ticaret',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Codifya E-Ticaret',
    description: 'Modern ve kullanıcı dostu bir e-ticaret platformu. En yeni ürünler ve kampanyalar için hemen alışverişe başlayın.',
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  other: {
    'Cache-Control': 'public, max-age=3600, must-revalidate',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        {/* Preload kritik kaynaklar */}
        <link rel="preload" href="/images/hero-image.jpg" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* PWA için manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <Providers>
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
