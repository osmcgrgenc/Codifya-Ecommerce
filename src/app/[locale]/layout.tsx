import '../globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Providers } from '../providers';
import { ToastProvider } from '@/components/ui/use-toast';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#4f46e5',
};

export const metadata: Metadata = {
  title: 'Codifya E-Ticaret',
  description:
    'Modern ve kullanıcı dostu bir e-ticaret platformu. En yeni ürünler ve kampanyalar için hemen alışverişe başlayın.',
  // ... rest of metadata
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  
  const messages = (await import(`../../messages/${locale}/index.json`)).default;

  return (
    <html lang={locale}>
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