'use client';

import { useCart } from '@/lib/hooks/use-cart';
import Link from 'next/link';
import { Product, Category, ProductImage } from '@prisma/client';
import Image from 'next/image';
interface ProductCardProps {
  product: Product & {
    category?: Category | null;
    images: ProductImage[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images.find(img => img.isMain)?.url || '/images/placeholder.jpg',
      quantity: 1,
      category: product.category?.name || 'Kategori Yok',
    });
  };

  // Placeholder görüntüsü
  const imageSrc = product.images.find(img => img.isMain)?.url || '/images/placeholder.jpg';

  return (
    <div className=" rounded-lg shadow overflow-hidden">
      <Link href={`/shop/product/${product.id}`}>
        <div className="w-full h-48 relative">
          <Image
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover"
            width={500}
            height={500}
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/shop/product/${product.id}`}>
          <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-2">{product.category?.name || 'Kategori Yok'}</p>
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
