'use client';

import { useState } from 'react';
import { useCart } from '@/lib/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Product, Category } from '@prisma/client';
import Image from 'next/image';
interface ProductDetailProps {
  product: Product & {
    category: Category | null;
    images: {
      url: string;
      isMain: boolean;
    }[];
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || '/images/placeholder.jpg',
      quantity: quantity,
      category: product.category?.name || 'Kategori Yok',
    });
  };

  const imageSrc = product.images[0]?.url || '/images/placeholder.jpg';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className=" rounded-lg overflow-hidden shadow-md">
          <Image
            src={imageSrc}
            alt={product.name}
            className="w-full h-auto object-cover"
            width={500}
            height={500}
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.category?.name || 'Kategori Yok'}</p>
          <p className="text-2xl font-bold mb-6">
            {product.price.toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY',
            })}
          </p>

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Ürün Açıklaması</h2>
            <p className="text-gray-600">
              {product.description || 'Bu ürün hakkında detaylı açıklama burada yer alacak.'}
            </p>
          </div>

          {product.stock !== undefined && (
            <div className="mb-4">
              <span
                className={`text-sm ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}
              >
                {product.stock > 10
                  ? 'Stokta var'
                  : product.stock > 0
                    ? `Son ${product.stock} ürün`
                    : 'Stokta yok'}
              </span>
            </div>
          )}

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-3 py-1">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                disabled={product.stock !== undefined && quantity >= product.stock}
              >
                +
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              className="flex-1"
              disabled={product.stock !== undefined && product.stock <= 0}
            >
              Sepete Ekle
            </Button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-medium mb-2">Özellikler</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li className="text-gray-600">Özellik 1</li>
              <li className="text-gray-600">Özellik 2</li>
              <li className="text-gray-600">Özellik 3</li>
              <li className="text-gray-600">Özellik 4</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
