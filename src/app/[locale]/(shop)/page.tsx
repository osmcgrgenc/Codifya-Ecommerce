import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { categoryService, productService, heroService } from '@/services';
import ProductCard from '@/app/[locale]/(shop)/shop/product-card';
import { Category, Product } from '@prisma/client';
import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

// Dinamik metadata için generateMetadata fonksiyonu
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'HomePage.metadata' });
  
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: '/',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: process.env.NEXT_PUBLIC_SITE_NAME || 'Epoksi Ürünleri',
        },
      ],
    },
  };
}

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
async function Categories({ locale }: { locale: string }) {
  const categories = await categoryService.getAllCategories();
  const t = await getTranslations({ locale, namespace: 'HomePage.sections' });

  return (
    <section className="mb-12" aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="text-2xl font-bold mb-6">
        {t('categories')}
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
async function FeaturedProducts({ locale }: { locale: string }) {
  const featuredProductsData = await productService.getFeaturedProducts();
  const t = await getTranslations({ locale, namespace: 'HomePage.sections' });
  const tCategories = await getTranslations({ locale, namespace: 'HomePage.categories' });

  // Ürünleri Product tipine dönüştür
  const featuredProducts = featuredProductsData.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.images.find(img => img.isMain)?.url || '/images/placeholder.jpg',
    category: product.category?.name || tCategories('noCategory'),
    description: product.description || undefined,
    stock: product.stock,
  }));

  return (
    <section className="mb-12" aria-labelledby="featured-heading">
      <div className="flex justify-between items-center mb-6">
        <h2 id="featured-heading" className="text-2xl font-bold">
          {t('featuredProducts')}
        </h2>
        <Link href="/shop" className="text-indigo-600 hover:text-indigo-800">
          {t('viewAll')}
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
async function HeroSection({ locale }: { locale: string }) {
  const tHero = await getTranslations({ locale, namespace: 'HomePage.hero' });
  
  const defaultHero = {
    title: tHero('defaultTitle'),
    description: tHero('defaultDescription'),
    buttonText: tHero('defaultButtonText'),
    imageUrl: '/images/epoxy-hero-art.jpg' // TODO: Bu görseli sanatsal ve yüksek kaliteli bir epoksi ürün görseli ile değiştirin.
  };
  const hero = await heroService.getActiveHero() || defaultHero;
  return (
    <section
        className="relative bg-indigo-600 rounded-lg overflow-hidden mb-12"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 opacity-90"></div>
        <div className="relative z-10 px-8 py-16 md:py-24 md:px-12 flex flex-col items-start max-w-2xl">
          <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold text-white mb-4">
            {hero.title}
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-lg">
            {hero.description}
          </p>
          <Link href="/shop">
            <Button size="lg" className="text-indigo-600 hover:bg-indigo-50">
              {hero.buttonText}
            </Button>
          </Link>
        </div>
        <div className="hidden md:block absolute right-0 top-0 w-1/2 h-full">
          <Image
            src={hero.imageUrl}
            alt={hero.title}
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
        </div>
      </section>
  );
}
export default async function HomePage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'HomePage' });
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <Suspense fallback={<div className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>}>
        <HeroSection locale={params.locale} />
      </Suspense>

      {/* Suspense ile sarmalayarak bfcache performansını artıralım */}
      <Suspense fallback={<div className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>}>
        <Categories locale={params.locale} />
      </Suspense>

      <Suspense fallback={<div className="h-60 bg-gray-100 rounded-lg animate-pulse"></div>}>
        <FeaturedProducts locale={params.locale} />
      </Suspense>

      {/* Promotions */}
      <section className="mb-12" aria-labelledby="promotions-heading">
        <h2 id="promotions-heading" className="sr-only">
          {t('sections.promotions')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <div className="p-8 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">{t('promotions.summer.title')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('promotions.summer.description')}
                </p>
              </div>
              <Link href="/shop/category/giyim">
                <Button>{t('promotions.summer.button')}</Button>
              </Link>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <div className="p-8 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">{t('promotions.tech.title')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('promotions.tech.description')}
                </p>
              </div>
              <Link href="/shop/category/elektronik">
                <Button>{t('promotions.tech.button')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-indigo-50 rounded-lg p-8 mb-12" aria-labelledby="newsletter-heading">
        <div className="max-w-2xl mx-auto text-center">
          <h2 id="newsletter-heading" className="text-2xl font-bold mb-4">
            {t('newsletter.title')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('newsletter.description')}
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <label htmlFor="email-input" className="sr-only">
              {t('newsletter.placeholder')}
            </label>
            <input
              id="email-input"
              type="email"
              placeholder={t('newsletter.placeholder')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <Button type="submit" className="sm:flex-shrink-0">
              {t('newsletter.button')}
            </Button>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="mb-12" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">
          {t('sections.features')}
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
            title={t('features.freeShipping.title')}
            description={t('features.freeShipping.description')}
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
            title={t('features.fastDelivery.title')}
            description={t('features.fastDelivery.description')}
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
            title={t('features.securePayment.title')}
            description={t('features.securePayment.description')}
          />
        </div>
      </section>
    </div>
  );
}
