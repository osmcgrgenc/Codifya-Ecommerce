import { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from './product-card';
import { categoryService, productService } from '@/services';

export const metadata: Metadata = {
  title: 'Mağaza | Codifya E-Ticaret',
  description: 'Ürünlerimizi keşfedin ve alışveriş yapın',
};

export default async function ShopPage() {
  // Veritabanından ürünleri ve kategorileri çek
  const products = await productService.getAllProducts();
  const categories = await categoryService.getAllCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mağaza</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Kategoriler</h2>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/shop/category/${category.slug}`}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
