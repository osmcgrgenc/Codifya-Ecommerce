import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { categoryService } from '@/services';
import ProductsGrid from './products-grid';
import ProductsLoading from './products-loading';

export const metadata: Metadata = {
  title: 'Mağaza | Codifya E-Ticaret',
  description: 'Ürünlerimizi keşfedin ve alışveriş yapın',
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 saat

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string; category?: string };
}) {
  // URL parametrelerinden sayfa ve limit değerlerini al
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 12;
  const categorySlug = searchParams.category;

  // Veritabanından kategorileri çek
  const categoriesPromise = categoryService.getAllCategories();

  // Kategorileri bekle
  const categories = await categoriesPromise;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mağaza</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Kategoriler</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className={`text-gray-600 hover:text-gray-900 ${!categorySlug ? 'font-bold' : ''}`}
                >
                  Tüm Ürünler
                </Link>
              </li>
              {categories.map(category => (
                <li key={category.id}>
                  <Link
                    href={`/shop?category=${category.slug}`}
                    className={`text-gray-600 hover:text-gray-900 ${categorySlug === category.slug ? 'font-bold' : ''}`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <Suspense fallback={<ProductsLoading />}>
            <ProductsGrid page={page} limit={limit} categorySlug={categorySlug} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
