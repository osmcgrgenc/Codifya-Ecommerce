'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { SessionProvider, useSession } from 'next-auth/react';
import { CartProvider } from '@/lib/hooks/use-cart';

type ProvidersProps = {
  children: React.ReactNode;
  messages: any;
  locale: string;
};

function ProvidersContent({ children, messages, locale }: ProvidersProps) {
  const { data: session } = useSession();

  return (
    <NextIntlClientProvider 
      messages={messages} 
      locale={locale}
      timeZone="Europe/Istanbul"
      now={new Date()}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CartProvider>{children}</CartProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

export function Providers({ children, messages, locale }: ProvidersProps) {
  return (
    <SessionProvider>
      <ProvidersContent messages={messages} locale={locale}>
        {children}
      </ProvidersContent>
    </SessionProvider>
  );
}
