import Link from 'next/link';
import { productService } from '@/services';
import ProductCard from './product-card';
import PaginationControls from './pagination';

interface ProductsGridProps {
  page: number;
  limit: number;
  categorySlug?: string;
}

export default async function ProductsGrid({ page, limit, categorySlug }: ProductsGridProps) {
  // Filtreleme seçeneklerini oluştur
  const filters = categorySlug ? { category: categorySlug } : undefined;

  // Sayfalanmış ürünleri getir
  const {
    data: products,
    total,
    totalPages,
  } = await productService.getPaginatedProducts(page, limit, filters);

  // Eğer ürün yoksa
  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium mb-2">Ürün Bulunamadı</h3>
        <p className="text-gray-600">Seçilen kriterlere uygun ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            createHref={(pageNumber: number) => {
              const params = new URLSearchParams();
              params.set('page', pageNumber.toString());
              if (limit !== 12) params.set('limit', limit.toString());
              if (categorySlug) params.set('category', categorySlug);
              return `/shop?${params.toString()}`;
            }}
          />
        </div>
      )}
    </div>
  );
}
