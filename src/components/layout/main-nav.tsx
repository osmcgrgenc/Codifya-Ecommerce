'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { categoryService } from '@/services/category/category.service';
import { Category } from '@prisma/client';

interface MainNavProps {
  className?: string;
  categories?: Category[];
}

export function MainNav({ className, categories }: MainNavProps) {
  const pathname = usePathname();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [subCategories, setSubCategories] = useState<Category[]>([]);

  const routes = [
    {
      href: '/',
      label: 'Ana Sayfa',
      active: pathname === '/',
    },
    {
      href: '/shop',
      label: 'Mağaza',
      active: pathname === '/shop',
      hasMegaMenu: true,
    },
    {
      href: '/about',
      label: 'Hakkımızda',
      active: pathname === '/about',
    },
    {
      href: '/contact',
      label: 'İletişim',
      active: pathname === '/contact',
    },
  ];
  
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      {routes.map(route => (
        <div
          key={route.href}
          className="relative"
          onMouseEnter={() => route.hasMegaMenu && setIsMegaMenuOpen(true)}
          onMouseLeave={() => route.hasMegaMenu && setIsMegaMenuOpen(false)}
        >
          <Link
            href={route.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
            )}
          >
            {route.label}
          </Link>
          {route.hasMegaMenu && isMegaMenuOpen && (
            <div className="absolute left-0 w-max max-w-screen-md  shadow-lg rounded-md overflow-hidden z-50 bg-gray-50"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <div className="grid grid-cols-3 gap-4 p-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Kategoriler</h3>
                  <ul className="space-y-2">
                    {categories?.map((category) => (
                      category.parentId === null && (
                        <li key={category.id}>
                          <Link
                            href={`/shop/category/${category.slug}`}
                            className="text-sm text-gray-600 hover:text-gray-900"
                            onClick={() => {
                              setIsMegaMenuOpen(false);
                              setSubCategories([]);
                            }}
                            onMouseEnter={async () => {
                              // Alt kategorileri getir
                              try {
                                const subCategories = await categoryService.getSubCategories(category.id);
                                setSubCategories(subCategories);
                              } catch (error) {
                                setSubCategories([]);
                              }
                            }}
                          >
                            {category.name}
                          </Link>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Alt Kategoriler</h3>
                  <ul className="space-y-2">
                    {subCategories.map((subCategory) => (
                      <li key={subCategory.id}>
                        <Link
                          href={`/shop/category/${subCategory.slug}`}
                          className="text-sm text-primary hover:text-gray-900"
                          onClick={() => setIsMegaMenuOpen(false)}
                        >
                          {subCategory.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Öne Çıkanlar</h3>
                  <div className="space-y-4">
                    <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src="/images/products/headphones.jpg"
                        alt="Öne Çıkan Ürün"
                        className="object-cover"
                        width={150}
                        height={150}
                      />
                      <div className="p-2">
                        <p className="text-sm font-medium text-gray-900">Yeni Ürünler</p>
                        <p className="text-xs text-gray-500">En yeni ürünlerimizi keşfedin</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
