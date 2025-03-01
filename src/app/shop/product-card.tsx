'use client';

import { useCart } from '@/lib/hooks/use-cart';
import Link from 'next/link';
import { Product, Category } from '@prisma/client';

interface ProductCardProps {
  product: Product & { 
    category?: Category | null
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || '/images/placeholder.jpg',
      quantity: 1,
      category: product.category?.name || 'Kategori Yok',
    });
  };

  // Placeholder görüntüsü
  const imageSrc = product.image || '/images/placeholder.jpg';

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Link href={`/shop/product/${product.id}`}>
        <div className="w-full h-48 relative">
          <img 
            src={imageSrc} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/shop/product/${product.id}`}>
          <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-2">
          {product.category?.name || 'Kategori Yok'}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold">
            {product.price.toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY',
            })}
          </p>
          <button
            onClick={handleAddToCart}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
