'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/lib/hooks/use-cart';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CartProvider>{children}</CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
