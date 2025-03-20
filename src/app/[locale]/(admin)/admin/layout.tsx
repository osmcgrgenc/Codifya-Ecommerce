import '@/app/globals.css';
import { AdminLayoutContent } from './admin-layout-content';
import { Providers } from '@/app/providers';
import { ToastProvider } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default async function AdminLayout({ children,
  params: { locale },
}: { children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = (await import(`../../../../../messages/${locale}/index.json`)).default;
  
  return (
    <html lang={locale}>
      <head>
        <link rel="preload" href="/images/hero-image.jpg" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ToastProvider>
          <Providers messages={messages} locale={locale}>
            <AdminLayoutContent>{children}</AdminLayoutContent>
          <Toaster />
          </Providers>
        </ToastProvider>
      </body>
    </html>
  );
}
