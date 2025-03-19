'use client';

import { useCart } from '@/lib/hooks/use-cart';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/shop/product/${product.id}`} className="block aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={false}
        />
      </Link>
      <div className="p-4">
        <Link href={`/shop/product/${product.id}`} className="block">
          <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
        </Link>
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-gray-900">
            {product.price.toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY',
            })}
          </p>
          <button
            onClick={handleAddToCart}
            className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition-colors"
            aria-label={`${product.name} ürününü sepete ekle`}
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
