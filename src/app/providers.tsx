'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/lib/hooks/use-cart';
import { useSession } from 'next-auth/react';

type ProvidersProps = {
  children: React.ReactNode;
  messages: any;
  locale: string;
};

export function Providers({ children, messages, locale }: ProvidersProps) {
  const { data: session } = useSession();

  return (
    <SessionProvider session={session}>
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
    </SessionProvider>
  );
}
