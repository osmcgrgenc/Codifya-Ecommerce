import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { categoryService, productService } from '@/services';
import ProductCard from '@/app/shop/product-card';
import { Category, Product } from '@prisma/client';
import { Suspense } from 'react';

// Yapılandırılmış metadata
export const metadata = {
  title: 'Codifya E-Ticaret - Modern Alışveriş Deneyimi',
  description:
    'Codifya E-Ticaret ile en yeni ürünleri keşfedin. Moda, elektronik, ev eşyaları ve daha fazlası için alışveriş yapın. %20 indirim fırsatını kaçırmayın!',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Codifya E-Ticaret - Modern Alışveriş Deneyimi',
    description:
      'Codifya E-Ticaret ile en yeni ürünleri keşfedin. Moda, elektronik, ev eşyaları ve daha fazlası için alışveriş yapın. %20 indirim fırsatını kaçırmayın!',
    url: '/',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Codifya E-Ticaret',
      },
    ],
  },
};

// Kategori kartı bileşeni - performans için ayrı bileşen
interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/shop/category/${category.slug}`} className="group">
      <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square relative">
        <div className="absolute inset-0">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
              priority={false}
              loading="lazy"
            />
          ) : (
            <Image
              src="/images/placeholder.jpg"
              alt={category.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
              priority={false}
              loading="lazy"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-white text-xl font-bold">{category.name}</h3>
        </div>
      </div>
    </Link>
  );
}

// Özellik kartı bileşeni - performans için ayrı bileşen
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className=" p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="bg-indigo-100 p-3 rounded-full mr-4">{icon}</div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Kategoriler bileşeni - Suspense ile sarmalayarak bfcache performansını artıralım
async function Categories() {
  const categories = await categoryService.getAllCategories();

  return (
    <section className="mb-12" aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="text-2xl font-bold mb-6">
        Kategoriler
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.slice(0, 4).map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}

// Öne çıkan ürünler bileşeni - Suspense ile sarmalayarak bfcache performansını artıralım
async function FeaturedProducts() {
  const featuredProducts = await productService.getFeaturedProducts();

  return (
    <section className="mb-12" aria-labelledby="featured-heading">
      <div className="flex justify-between items-center mb-6">
        <h2 id="featured-heading" className="text-2xl font-bold">
          Öne Çıkan Ürünler
        </h2>
        <Link href="/shop" className="text-indigo-600 hover:text-indigo-800">
          Tümünü Gör →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section
        className="relative bg-indigo-600 rounded-lg overflow-hidden mb-12"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 opacity-90"></div>
        <div className="relative z-10 px-8 py-16 md:py-24 md:px-12 flex flex-col items-start max-w-2xl">
          <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold text-white mb-4">
            Yeni Sezon Ürünleri
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-lg">
            En yeni ve trend ürünleri keşfedin. Sınırlı süre için tüm yeni sezon ürünlerinde %20
            indirim!
          </p>
          <Link href="/shop">
            <Button size="lg" className=" text-indigo-600 hover:bg-indigo-50">
              Hemen Alışverişe Başla
            </Button>
          </Link>
        </div>
        <div className="hidden md:block absolute right-0 top-0 w-1/2 h-full">
          <Image
            src="/images/hero-image.jpg"
            alt="Yeni Sezon Ürünleri"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
        </div>
      </section>

      {/* Suspense ile sarmalayarak bfcache performansını artıralım */}
      <Suspense fallback={<div className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>}>
        <Categories />
      </Suspense>

      <Suspense fallback={<div className="h-60 bg-gray-100 rounded-lg animate-pulse"></div>}>
        <FeaturedProducts />
      </Suspense>

      {/* Promotions */}
      <section className="mb-12" aria-labelledby="promotions-heading">
        <h2 id="promotions-heading" className="sr-only">
          Promosyonlar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <div className="p-8 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Yaz İndirimleri</h3>
                <p className="text-gray-600 mb-4">
                  Yaz koleksiyonunda %30 varan indirimler sizi bekliyor!
                </p>
              </div>
              <Link href="/shop/category/giyim">
                <Button>Keşfet</Button>
              </Link>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <div className="p-8 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Teknoloji Fırsatları</h3>
                <p className="text-gray-600 mb-4">
                  En yeni teknoloji ürünlerinde özel fiyatlar ve hediyeler!
                </p>
              </div>
              <Link href="/shop/category/elektronik">
                <Button>Keşfet</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-indigo-50 rounded-lg p-8 mb-12" aria-labelledby="newsletter-heading">
        <div className="max-w-2xl mx-auto text-center">
          <h2 id="newsletter-heading" className="text-2xl font-bold mb-4">
            Bültenimize Abone Olun
          </h2>
          <p className="text-gray-600 mb-6">
            Yeni ürünler, indirimler ve özel tekliflerden haberdar olmak için bültenimize abone
            olun.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <label htmlFor="email-input" className="sr-only">
              E-posta adresiniz
            </label>
            <input
              id="email-input"
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <Button type="submit" className="sm:flex-shrink-0">
              Abone Ol
            </Button>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="mb-12" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">
          Özelliklerimiz
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            }
            title="Ücretsiz Kargo"
            description="500 TL ve üzeri alışverişlerinizde Türkiye'nin her yerine ücretsiz kargo."
          />

          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            title="Hızlı Teslimat"
            description="Siparişleriniz aynı gün içinde hazırlanır ve en hızlı şekilde size ulaştırılır."
          />

          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            }
            title="Güvenli Ödeme"
            description="Tüm ödemeleriniz 256-bit SSL sertifikası ile şifrelenerek güvenle gerçekleştirilir."
          />
        </div>
      </section>
    </div>
  );
}
