import { Metadata } from 'next';
import Link from 'next/link';
import { productService } from '@/services';
import ProductCard from '../shop/product-card';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export const metadata: Metadata = {
  title: 'Arama Sonuçları | Codifya E-Ticaret',
  description: 'Arama sonuçlarınız',
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const products = query ? await productService.searchProducts(query) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Arama Sonuçları</h1>
      <p className="text-gray-500 mb-8">
        "{query}" için {products.length} sonuç bulundu
      </p>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h2 className="text-xl font-medium mb-4">Sonuç bulunamadı</h2>
          <p className="text-gray-500 mb-8">
            Aramanız için ürün bulunamadı. Lütfen farklı anahtar kelimelerle tekrar deneyin.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Tüm Ürünleri Görüntüle
          </Link>
        </div>
      )}
    </div>
  );
} 