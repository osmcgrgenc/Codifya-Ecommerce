'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { useCart } from '@/lib/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

interface ProductPageProps {
  params: {
    id: string;
  };
}

// Örnek ürün verileri - gerçek uygulamada API'den gelecek
const products: Product[] = [
  {
    id: '1',
    name: 'Akıllı Telefon',
    price: 5999.99,
    image: 'https://via.placeholder.com/300',
    category: 'Elektronik',
    description:
      'Son teknoloji akıllı telefon, yüksek performans ve uzun pil ömrü. 6.5 inç AMOLED ekran, 128GB depolama, 8GB RAM, 48MP kamera.',
    stock: 15,
  },
  {
    id: '2',
    name: 'Laptop',
    price: 12999.99,
    image: 'https://via.placeholder.com/300',
    category: 'Elektronik',
    description:
      'Güçlü işlemci ve yüksek çözünürlüklü ekran ile profesyonel laptop. Intel Core i7, 16GB RAM, 512GB SSD, 15.6 inç 4K ekran.',
    stock: 8,
  },
  {
    id: '3',
    name: 'Kablosuz Kulaklık',
    price: 1299.99,
    image: 'https://via.placeholder.com/300',
    category: 'Elektronik',
    description:
      'Gürültü önleyici özellikli, uzun pil ömürlü kablosuz kulaklık. 30 saat pil ömrü, aktif gürültü engelleme, su geçirmez tasarım.',
    stock: 25,
  },
  {
    id: '4',
    name: 'Erkek T-Shirt',
    price: 299.99,
    image: 'https://via.placeholder.com/300',
    category: 'Giyim',
    description:
      'Yüksek kaliteli pamuktan üretilmiş, rahat kesim erkek t-shirt. %100 organik pamuk, çeşitli renk seçenekleri, tüm bedenler mevcut.',
    stock: 50,
  },
  {
    id: '5',
    name: 'Kadın Elbise',
    price: 499.99,
    image: 'https://via.placeholder.com/300',
    category: 'Giyim',
    description:
      'Şık tasarımlı, her mevsim giyilebilen kadın elbisesi. Rahat kesim, nefes alabilen kumaş, modern tasarım.',
    stock: 30,
  },
  {
    id: '6',
    name: 'Spor Ayakkabı',
    price: 899.99,
    image: 'https://via.placeholder.com/300',
    category: 'Giyim',
    description:
      'Hafif ve dayanıklı, her türlü aktivite için uygun spor ayakkabı. Darbe emici taban, nefes alabilen üst malzeme, ergonomik tasarım.',
    stock: 20,
  },
];

export default function ProductPage({ params }: ProductPageProps) {
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Ürün ID'sine göre ürünü bul
    const foundProduct = products.find(p => p.id === params.id);

    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [params.id]);

  if (!product) {
    return notFound();
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      category: product.category,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <img src={product.image} alt={product.name} className="w-full h-auto object-cover" />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.category}</p>
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

          {product.stock && (
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
              <li>Özellik 1</li>
              <li>Özellik 2</li>
              <li>Özellik 3</li>
              <li>Özellik 4</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
