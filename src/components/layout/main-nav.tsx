"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const routes = [
    {
      href: "/",
      label: "Ana Sayfa",
      active: pathname === "/",
    },
    {
      href: "/shop",
      label: "Mağaza",
      active: pathname === "/shop",
      hasMegaMenu: true,
    },
    {
      href: "/about",
      label: "Hakkımızda",
      active: pathname === "/about",
    },
    {
      href: "/contact",
      label: "İletişim",
      active: pathname === "/contact",
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <div
          key={route.href}
          className="relative"
          onMouseEnter={() => route.hasMegaMenu && setIsMegaMenuOpen(true)}
          onMouseLeave={() => route.hasMegaMenu && setIsMegaMenuOpen(false)}
        >
          <Link
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active
                ? "text-black dark:text-white"
                : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
          {route.hasMegaMenu && isMegaMenuOpen && (
            <div className="absolute left-0 mt-2 w-screen max-w-screen-md bg-white shadow-lg rounded-md overflow-hidden z-50">
              <div className="grid grid-cols-3 gap-4 p-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Kategoriler
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/shop/category/electronics"
                        className="text-sm text-gray-600 hover:text-gray-900"
                        onClick={() => setIsMegaMenuOpen(false)}
                      >
                        Elektronik
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop/category/clothing"
                        className="text-sm text-gray-600 hover:text-gray-900"
                        onClick={() => setIsMegaMenuOpen(false)}
                      >
                        Giyim
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop/category/home"
                        className="text-sm text-gray-600 hover:text-gray-900"
                        onClick={() => setIsMegaMenuOpen(false)}
                      >
                        Ev & Yaşam
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop/category/books"
                        className="text-sm text-gray-600 hover:text-gray-900"
                        onClick={() => setIsMegaMenuOpen(false)}
                      >
                        Kitaplar
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Alt Kategoriler
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/shop/category/electronics/phones"
                        className="text-sm text-gray-600 hover:text-gray-900"
                        onClick={() => setIsMegaMenuOpen(false)}
                      >
                        Telefonlar
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop/category/electronics/laptops"
                        className="text-sm text-gray-600 hover:text-gray-900"
                        onClick={() => setIsMegaMenuOpen(false)}
                      >
                        Laptoplar
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop/category/clothing/men"
                        className="text-sm text-gray-600 hover:text-gray-900"
                        onClick={() => setIsMegaMenuOpen(false)}
                      >
                        Erkek Giyim
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop/category/clothing/women"
                        className="text-sm text-gray-600 hover:text-gray-900"
                        onClick={() => setIsMegaMenuOpen(false)}
                      >
                        Kadın Giyim
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Öne Çıkanlar
                  </h3>
                  <div className="space-y-4">
                    <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src="https://via.placeholder.com/300x200"
                        alt="Öne Çıkan Ürün"
                        className="object-cover"
                      />
                      <div className="p-2">
                        <p className="text-sm font-medium text-gray-900">
                          Yeni Ürünler
                        </p>
                        <p className="text-xs text-gray-500">
                          En yeni ürünlerimizi keşfedin
                        </p>
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