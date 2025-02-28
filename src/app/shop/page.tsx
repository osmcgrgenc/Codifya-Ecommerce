import { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from './product-card';
import { Product } from '@/types';

export const metadata: Metadata = {
  title: 'Mağaza | Codifya E-Ticaret',
  description: 'Ürünlerimizi keşfedin ve alışveriş yapın',
};

// Örnek ürün verileri
const products: Product[] = [
  {
    id: '1',
    name: 'Akıllı Telefon',
    price: 5999.99,
    image: 'https://via.placeholder.com/300',
    category: 'Elektronik',
    description: 'Son teknoloji akıllı telefon, yüksek performans ve uzun pil ömrü.',
    stock: 15,
  },
  {
    id: '2',
    name: 'Laptop',
    price: 12999.99,
    image: 'https://via.placeholder.com/300',
    category: 'Elektronik',
    description: 'Güçlü işlemci ve yüksek çözünürlüklü ekran ile profesyonel laptop.',
    stock: 8,
  },
  {
    id: '3',
    name: 'Kablosuz Kulaklık',
    price: 1299.99,
    image: 'https://via.placeholder.com/300',
    category: 'Elektronik',
    description: 'Gürültü önleyici özellikli, uzun pil ömürlü kablosuz kulaklık.',
    stock: 25,
  },
  {
    id: '4',
    name: 'Erkek T-Shirt',
    price: 299.99,
    image: 'https://via.placeholder.com/300',
    category: 'Giyim',
    description: 'Yüksek kaliteli pamuktan üretilmiş, rahat kesim erkek t-shirt.',
    stock: 50,
  },
  {
    id: '5',
    name: 'Kadın Elbise',
    price: 499.99,
    image: 'https://via.placeholder.com/300',
    category: 'Giyim',
    description: 'Şık tasarımlı, her mevsim giyilebilen kadın elbisesi.',
    stock: 30,
  },
  {
    id: '6',
    name: 'Spor Ayakkabı',
    price: 899.99,
    image: 'https://via.placeholder.com/300',
    category: 'Giyim',
    description: 'Hafif ve dayanıklı, her türlü aktivite için uygun spor ayakkabı.',
    stock: 20,
  },
];

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mağaza</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Kategoriler</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop/category/electronics"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Elektronik
                </Link>
              </li>
              <li>
                <Link href="/shop/category/clothing" className="text-gray-600 hover:text-gray-900">
                  Giyim
                </Link>
              </li>
              <li>
                <Link href="/shop/category/home" className="text-gray-600 hover:text-gray-900">
                  Ev & Yaşam
                </Link>
              </li>
              <li>
                <Link href="/shop/category/books" className="text-gray-600 hover:text-gray-900">
                  Kitaplar
                </Link>
              </li>
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
