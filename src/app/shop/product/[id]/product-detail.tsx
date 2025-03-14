'use client';

import { useState } from 'react';
import { useCart } from '@/lib/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Product, Category, Brand, ProductImage, Variation, VariationOption, OptionType } from '@prisma/client';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { StarIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Satıcı tipi
type Seller = {
  id: string;
  name: string;
  logoUrl?: string | null;
};

// Varyasyon tipi
type VariationWithOptions = Variation & {
  options: (VariationOption & {
    optionType: OptionType;
  })[];
};

// Ürün tipi
interface ProductDetailProps {
  product: Product & {
    category: Category | null;
    brand: Brand | null;
    images: ProductImage[];
    variations: VariationWithOptions[];
    sellers?: Seller[];
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<VariationWithOptions | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState('description');

  // Ana görseli bul
  const mainImage = product.images.find(img => img.isMain)?.url || product.images[0]?.url || '/images/placeholder.jpg';
  
  // Diğer görselleri bul
  const otherImages = product.images.filter(img => !img.isMain).map(img => img.url);
  
  // Tüm görselleri birleştir (ana görsel ilk sırada)
  const allImages = [mainImage, ...otherImages];

  // Varyasyon seçimi
  const handleVariationSelect = (variation: VariationWithOptions) => {
    setSelectedVariation(variation);
  };

  // Sepete ekle
  const handleAddToCart = () => {
    // Eğer varyasyon seçilmişse onu, seçilmemişse ana ürünü ekle
    const itemToAdd = selectedVariation 
      ? {
          id: selectedVariation.id,
          name: `${product.name} - ${selectedVariation.options.map(opt => `${opt.optionType.name}: ${opt.value}`).join(', ')}`,
          price: Number(selectedVariation.price),
          image: mainImage,
          quantity: quantity,
          category: product.category?.name || 'Kategori Yok',
        }
      : {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: mainImage,
          quantity: quantity,
          category: product.category?.name || 'Kategori Yok',
        };
    
    addItem(itemToAdd);
  };

  // Fiyat hesaplama
  const price = selectedVariation ? selectedVariation.price : product.price;
  
  // Stok durumu
  const stock = selectedVariation ? selectedVariation.stock : product.stock;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Sol Taraf - Ürün Görselleri */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden border shadow-sm">
            <Image
              src={allImages[activeImageIndex]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          
          {/* Küçük Görseller */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {allImages.map((image, index) => (
                <div 
                  key={index}
                  className={`relative aspect-square rounded-md overflow-hidden border cursor-pointer transition-all ${
                    activeImageIndex === index ? 'ring-2 ring-indigo-500' : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Görsel ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 20vw, 10vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sağ Taraf - Ürün Bilgileri */}
        <div className="space-y-6">
          {/* Üst Bilgiler */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">
                {product.category?.name || 'Kategori Yok'}
              </Badge>
              {product.brand && (
                <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">
                  {product.brand.name}
                </Badge>
              )}
              {product.featured && (
                <Badge className="bg-amber-500">Öne Çıkan</Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon 
                    key={star} 
                    className="w-4 h-4 fill-amber-400 text-amber-400" 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">(120 Değerlendirme)</span>
            </div>
            
            <div className="text-2xl font-bold mb-2 text-indigo-700">
              {price.toLocaleString('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              })}
            </div>
            
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  stock > 10 
                    ? 'bg-green-100 text-green-800' 
                    : stock > 0 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {stock > 10
                  ? 'Stokta var'
                  : stock > 0
                    ? `Son ${stock} ürün`
                    : 'Stokta yok'}
              </span>
            </div>
          </div>
          
          <Separator />
          
          {/* Varyasyonlar */}
          {product.variations.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Varyasyonlar</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Varyasyon gruplarını oluştur */}
                {product.variations.length > 0 && (() => {
                  // Tüm opsiyon tiplerini bul
                  const optionTypes = Array.from(
                    new Set(
                      product.variations
                        .flatMap(v => v.options)
                        .map(o => o.optionType.name)
                    )
                  );
                  
                  return optionTypes.map(optionType => {
                    // Bu opsiyon tipine ait benzersiz değerleri bul
                    const optionValues = Array.from(
                      new Set(
                        product.variations
                          .flatMap(v => v.options)
                          .filter(o => o.optionType.name === optionType)
                          .map(o => o.value)
                      )
                    );
                    
                    return (
                      <div key={optionType} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {optionType}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {optionValues.map(value => {
                            // Bu değere sahip bir varyasyon bul
                            const variation = product.variations.find(v => 
                              v.options.some(o => 
                                o.optionType.name === optionType && o.value === value
                              )
                            );
                            
                            const isSelected = selectedVariation?.options.some(
                              o => o.optionType.name === optionType && o.value === value
                            );
                            
                            return (
                              <Button
                                key={value}
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                onClick={() => variation && handleVariationSelect(variation)}
                                className="rounded-full"
                              >
                                {value}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
              
              <Separator />
            </div>
          )}
          
          {/* Miktar ve Sepete Ekle */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md"
                  disabled={stock !== undefined && quantity >= stock}
                >
                  +
                </button>
              </div>
              
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                size="lg"
                disabled={stock !== undefined && stock <= 0}
              >
                Sepete Ekle
              </Button>
            </div>
          </div>
          
          {/* Satıcılar */}
          {product.sellers && product.sellers.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-medium mb-3">Satıcılar</h2>
              <div className="space-y-2">
                {product.sellers.map(seller => (
                  <Card key={seller.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                            {seller.logoUrl ? (
                              <Image
                                src={seller.logoUrl}
                                alt={seller.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                {seller.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{seller.name}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon 
                                    key={star} 
                                    className="w-3 h-3 fill-amber-400 text-amber-400" 
                                  />
                                ))}
                              </div>
                              <span className="ml-1">(4.8)</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Satıcıyı Gör
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Detay Sekmeleri */}
      <div className="mt-12">
        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Ürün Açıklaması</TabsTrigger>
            <TabsTrigger value="specifications">Özellikler</TabsTrigger>
            <TabsTrigger value="reviews">Değerlendirmeler</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">
                    {product.description || 'Bu ürün hakkında detaylı açıklama burada yer alacak.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Marka</span>
                      <span>{product.brand?.name || 'Belirtilmemiş'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Kategori</span>
                      <span>{product.category?.name || 'Belirtilmemiş'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Stok Durumu</span>
                      <span>{stock > 0 ? 'Stokta var' : 'Stokta yok'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Ürün Kodu</span>
                      <span>{product.id.substring(0, 8) || 'Belirtilmemiş'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Garanti</span>
                      <span>2 Yıl</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Kargo</span>
                      <span>Ücretsiz</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">Henüz değerlendirme yok</h3>
                  <p className="text-gray-500 mb-4">Bu ürün için ilk değerlendirmeyi siz yapın</p>
                  <Button>Değerlendirme Yap</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
