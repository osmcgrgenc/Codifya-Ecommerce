'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  FileSpreadsheet,
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  FileText,
  MessageSquare,
  File,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Ekran boyutunu izle ve küçük ekranlarda sidebar'ı otomatik kapat
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // İlk yükleme için kontrol et

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Yükleniyor durumu
  if (status === 'loading' || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Menü öğeleri
  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: 'Ürünler',
      href: '/admin/products',
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: 'Siparişler',
      href: '/admin/orders',
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: 'Kullanıcılar',
      href: '/admin/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Bloglar',
      href: '/admin/blogs',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Sayfalar',
      href: '/admin/pages',
      icon: <File className="h-5 w-5" />,
    },
    {
      title: 'İletişim Mesajları',
      href: '/admin/contact',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'Toplu İçe Aktarma',
      href: '/admin/import',
      icon: <FileSpreadsheet className="h-5 w-5" />,
    },
    {
      title: 'Ayarlar',
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobil menü butonu */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Paneli</h2>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <span className="mr-3 text-gray-500 dark:text-gray-400">{item.icon}</span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tema</span>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {mounted && theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => router.push('/')}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Siteye Dön
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          'flex-1 transition-all duration-200 ease-in-out',
          isSidebarOpen ? 'md:ml-64' : 'ml-0'
        )}
      >
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm p-4 md:p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Paneli</h1>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline text-sm text-gray-600 dark:text-gray-400">
                Merhaba, {session?.user?.name || 'Admin'}
              </span>
              <div className="md:hidden">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {mounted && theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
