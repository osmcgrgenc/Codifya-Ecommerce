import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { categoryService, productService } from '@/services';
import ProductCard from '../../product-card';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await categoryService.getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: 'Kategori Bulunamadı',
    };
  }

  return {
    title: `${category.name} | Codifya E-Ticaret`,
    description: category.description || `${category.name} kategorisindeki ürünleri keşfedin`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await categoryService.getCategoryBySlug(params.slug);

  if (!category) {
    return notFound();
  }

  const products = await productService.getProductsByCategory(params.slug);
  const categories = await categoryService.getAllCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Kategoriler</h2>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop/category/${cat.slug}`}
                    className={`text-gray-600 hover:text-gray-900 ${
                      cat.id === category.id ? 'font-bold text-indigo-600' : ''
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h2 className="text-xl font-medium mb-4">Bu kategoride ürün bulunamadı</h2>
              <p className="text-gray-500 mb-8">
                Şu anda bu kategoride ürün bulunmamaktadır. Lütfen daha sonra tekrar kontrol edin.
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
      </div>
    </div>
  );
} 