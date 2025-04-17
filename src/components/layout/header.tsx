import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { UserNav } from './user-nav';
import { MobileNav } from './mobile-nav';
import { MainNav } from './main-nav';
import { CartButton } from './cart-button';
import SearchBar from '@/components/search-bar';
import Image from 'next/image';

export async function Header() {
  const session = await getServerSession(authOptions);
  const isDarkMode = true;
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              <Image
                src={isDarkMode ? "/images/logo-dark.png" : "/images/logo-light.png"}
                alt="Logo"
                height={50}
                width={50}
                priority
              />
            </Link>
            <MainNav className="hidden md:ml-10 md:flex" />
          </div>

          <div className="hidden md:flex items-center mx-auto max-w-md w-full px-4">
            <SearchBar />
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/shop"
              className="hidden md:block text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Mağaza
            </Link>
            <CartButton />
            {session ? (
              <UserNav user={session.user} />
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
            <MobileNav session={session} />
          </div>
        </div>
      </div>
    </header>
  );
}
