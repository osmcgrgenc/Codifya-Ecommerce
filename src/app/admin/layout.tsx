'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Oturum durumunu kontrol et
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      // Burada gerçek bir uygulamada admin rolü kontrolü yapılmalı
      // Şimdilik basit bir kontrol yapıyoruz
      setIsAdmin(true);
    }
  }, [status, router]);

  // Yükleniyor durumu
  if (status === 'loading' || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64  shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Admin Paneli</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/admin" className="block p-2 rounded hover:bg-gray-100">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/products" className="block p-2 rounded hover:bg-gray-100">
                Ürünler
              </Link>
            </li>
            <li>
              <Link href="/admin/orders" className="block p-2 rounded hover:bg-gray-100">
                Siparişler
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="block p-2 rounded hover:bg-gray-100">
                Kullanıcılar
              </Link>
            </li>
            <li>
              <Link href="/admin/settings" className="block p-2 rounded hover:bg-gray-100">
                Ayarlar
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Paneli</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Merhaba, {session?.user?.name || 'Admin'}</span>
            <Button variant="outline" size="sm" onClick={() => router.push('/')}>
              Siteye Dön
            </Button>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
