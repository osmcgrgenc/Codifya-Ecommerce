import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative bg-indigo-600 rounded-lg overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 opacity-90"></div>
        <div className="relative z-10 px-8 py-16 md:py-24 md:px-12 flex flex-col items-start">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Yeni Sezon Ürünleri</h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-lg">
            En yeni ve trend ürünleri keşfedin. Sınırlı süre için tüm yeni sezon ürünlerinde %20
            indirim!
          </p>
          <Link href="/shop">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
              Hemen Alışverişe Başla
            </Button>
          </Link>
        </div>
        <div className="hidden md:block absolute right-0 bottom-0 w-1/3 h-full">
          <div
            className="h-full w-full bg-contain bg-bottom bg-no-repeat"
            style={{ backgroundImage: "url('https://via.placeholder.com/500')" }}
          ></div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Kategoriler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/shop/category/electronics" className="group">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://via.placeholder.com/300')" }}
              ></div>
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold">Elektronik</h3>
              </div>
            </div>
          </Link>
          <Link href="/shop/category/clothing" className="group">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://via.placeholder.com/300')" }}
              ></div>
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold">Giyim</h3>
              </div>
            </div>
          </Link>
          <Link href="/shop/category/home" className="group">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://via.placeholder.com/300')" }}
              ></div>
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold">Ev & Yaşam</h3>
              </div>
            </div>
          </Link>
          <Link href="/shop/category/books" className="group">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://via.placeholder.com/300')" }}
              ></div>
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold">Kitaplar</h3>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Öne Çıkan Ürünler</h2>
          <Link href="/shop" className="text-indigo-600 hover:text-indigo-800">
            Tümünü Gör →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Product 1 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Link href="/shop/product/1">
              <img
                src="https://via.placeholder.com/300"
                alt="Akıllı Telefon"
                className="w-full h-48 object-cover"
              />
            </Link>
            <div className="p-4">
              <Link href="/shop/product/1">
                <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600">
                  Akıllı Telefon
                </h3>
              </Link>
              <p className="text-sm text-gray-500 mb-2">Elektronik</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">5.999,99 ₺</p>
                <Link
                  href="/shop/product/1"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  İncele
                </Link>
              </div>
            </div>
          </div>

          {/* Product 2 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Link href="/shop/product/2">
              <img
                src="https://via.placeholder.com/300"
                alt="Laptop"
                className="w-full h-48 object-cover"
              />
            </Link>
            <div className="p-4">
              <Link href="/shop/product/2">
                <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600">Laptop</h3>
              </Link>
              <p className="text-sm text-gray-500 mb-2">Elektronik</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">12.999,99 ₺</p>
                <Link
                  href="/shop/product/2"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  İncele
                </Link>
              </div>
            </div>
          </div>

          {/* Product 3 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Link href="/shop/product/4">
              <img
                src="https://via.placeholder.com/300"
                alt="Erkek T-Shirt"
                className="w-full h-48 object-cover"
              />
            </Link>
            <div className="p-4">
              <Link href="/shop/product/4">
                <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600">
                  Erkek T-Shirt
                </h3>
              </Link>
              <p className="text-sm text-gray-500 mb-2">Giyim</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">299,99 ₺</p>
                <Link
                  href="/shop/product/4"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  İncele
                </Link>
              </div>
            </div>
          </div>

          {/* Product 4 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Link href="/shop/product/5">
              <img
                src="https://via.placeholder.com/300"
                alt="Kadın Elbise"
                className="w-full h-48 object-cover"
              />
            </Link>
            <div className="p-4">
              <Link href="/shop/product/5">
                <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600">
                  Kadın Elbise
                </h3>
              </Link>
              <p className="text-sm text-gray-500 mb-2">Giyim</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">499,99 ₺</p>
                <Link
                  href="/shop/product/5"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  İncele
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <div className="p-8 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Yaz İndirimleri</h3>
                <p className="text-gray-600 mb-4">
                  Yaz koleksiyonunda %30'a varan indirimler sizi bekliyor!
                </p>
              </div>
              <Link href="/shop/category/clothing">
                <Button>Keşfet</Button>
              </Link>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <div className="p-8 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Teknoloji Fırsatları</h3>
                <p className="text-gray-600 mb-4">
                  En yeni teknoloji ürünlerinde özel fiyatlar ve hediyeler!
                </p>
              </div>
              <Link href="/shop/category/electronics">
                <Button>Keşfet</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-indigo-50 rounded-lg p-8 mb-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Bültenimize Abone Olun</h2>
          <p className="text-gray-600 mb-6">
            Yeni ürünler, indirimler ve özel tekliflerden haberdar olmak için bültenimize abone
            olun.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button>Abone Ol</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
