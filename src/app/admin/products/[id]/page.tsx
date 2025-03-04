'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { productService } from '@/services/product-service';
import { variationService } from '@/services/variation-service';
import Image from 'next/image';
import { Product, ProductImage, Variation, VariationOption, OptionType } from '@prisma/client';

// Varyasyon tipi
type VariationWithOptions = Variation & {
  options: (VariationOption & {
    optionType: OptionType;
  })[];
};

// Ürün tipi
type ProductWithRelations = Product & {
  images: ProductImage[];
  variations: VariationWithOptions[];
  category: { name: string };
  brand: { name: string };
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<ProductWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [optionTypes, setOptionTypes] = useState<OptionType[]>([]);
  const [newVariation, setNewVariation] = useState({
    sku: '',
    price: 0,
    stock: 0,
    options: [] as { optionTypeId: string; value: string }[],
  });
  const [newImage, setNewImage] = useState({
    url: '',
    isMain: false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Ürün bilgilerini getir
  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const productData = await productService.getProductById(params.id as string);

        if (!productData) {
          toast({
            title: 'Hata',
            description: 'Ürün bulunamadı.',
            variant: 'destructive',
          });
          router.push('/admin/products');
          return;
        }

        setProduct(productData as unknown as ProductWithRelations);

        // Opsiyon tiplerini getir
        const optionTypesData = await variationService.getAllOptionTypes();
        setOptionTypes(optionTypesData);
      } catch (error) {
        toast({
          title: 'Hata',
          description: 'Ürün bilgileri yüklenirken bir hata oluştu.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router, toast]);

  // Varyasyon ekleme
  const handleAddVariation = async () => {
    if (!product) return;

    try {
      if (!newVariation.sku) {
        toast({
          title: 'Hata',
          description: 'SKU alanı zorunludur.',
          variant: 'destructive',
        });
        return;
      }

      const variation = await variationService.createVariation({
        productId: product.id,
        sku: newVariation.sku,
        price: newVariation.price,
        stock: newVariation.stock,
        options: newVariation.options.map(opt => ({
          optionType: opt.optionTypeId,
          value: opt.value,
        })),
      });

      // Ürünü yeniden yükle
      const updatedProduct = await productService.getProductById(product.id);
      setProduct(updatedProduct as unknown as ProductWithRelations);

      // Formu sıfırla
      setNewVariation({
        sku: '',
        price: 0,
        stock: 0,
        options: [],
      });

      toast({
        title: 'Başarılı',
        description: 'Varyasyon başarıyla eklendi.',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Varyasyon eklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  // Varyasyon silme
  const handleDeleteVariation = async (variationId: string) => {
    if (!product) return;

    try {
      await variationService.deleteVariation(variationId);

      // Ürünü yeniden yükle
      const updatedProduct = await productService.getProductById(product.id);
      setProduct(updatedProduct as unknown as ProductWithRelations);

      toast({
        title: 'Başarılı',
        description: 'Varyasyon başarıyla silindi.',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Varyasyon silinirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  // Görsel ekleme
  const handleAddImage = async () => {
    if (!product) return;

    try {
      if (!newImage.url) {
        toast({
          title: 'Hata',
          description: 'Görsel URL alanı zorunludur.',
          variant: 'destructive',
        });
        return;
      }

      await productService.addProductImage(product.id, {
        url: newImage.url,
        isMain: newImage.isMain,
      });

      // Ürünü yeniden yükle
      const updatedProduct = await productService.getProductById(product.id);
      setProduct(updatedProduct as unknown as ProductWithRelations);

      // Formu sıfırla
      setNewImage({
        url: '',
        isMain: false,
      });
      setImagePreview(null);

      toast({
        title: 'Başarılı',
        description: 'Görsel başarıyla eklendi.',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Görsel eklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  // Görsel silme
  const handleDeleteImage = async (imageId: string) => {
    if (!product) return;

    try {
      await productService.deleteProductImage(imageId);

      // Ürünü yeniden yükle
      const updatedProduct = await productService.getProductById(product.id);
      setProduct(updatedProduct as unknown as ProductWithRelations);

      toast({
        title: 'Başarılı',
        description: 'Görsel başarıyla silindi.',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Görsel silinirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  // Ana görsel ayarlama
  const handleSetMainImage = async (imageId: string) => {
    if (!product) return;

    try {
      // Önce mevcut ana görseli bul
      const mainImage = product.images.find(img => img.isMain);

      // Eğer zaten ana görsel ise işlem yapma
      if (mainImage?.id === imageId) return;

      // Mevcut ana görseli güncelle
      if (mainImage) {
        await productService.updateProductImage(mainImage.id, {
          url: mainImage.url,
          isMain: false,
        });
      }

      // Yeni ana görseli ayarla
      const newMainImage = product.images.find(img => img.id === imageId);
      if (newMainImage) {
        await productService.updateProductImage(imageId, {
          url: newMainImage.url,
          isMain: true,
        });
      }

      // Ürünü yeniden yükle
      const updatedProduct = await productService.getProductById(product.id);
      setProduct(updatedProduct as unknown as ProductWithRelations);

      toast({
        title: 'Başarılı',
        description: 'Ana görsel başarıyla güncellendi.',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Ana görsel ayarlanırken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  // Görsel önizleme
  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setNewImage({ ...newImage, url });
    setImagePreview(url);
  };

  // Varyasyon opsiyon değişikliği
  const handleOptionChange = (optionTypeId: string, value: string) => {
    const existingOptionIndex = newVariation.options.findIndex(
      opt => opt.optionTypeId === optionTypeId
    );

    if (existingOptionIndex >= 0) {
      // Mevcut opsiyonu güncelle
      const updatedOptions = [...newVariation.options];
      updatedOptions[existingOptionIndex] = { optionTypeId, value };
      setNewVariation({ ...newVariation, options: updatedOptions });
    } else {
      // Yeni opsiyon ekle
      setNewVariation({
        ...newVariation,
        options: [...newVariation.options, { optionTypeId, value }],
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">Ürün bulunamadı</h2>
          <Button onClick={() => router.push('/admin/products')}>Ürünlere Dön</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/products')}>
            Ürünlere Dön
          </Button>
          <Button onClick={() => router.push(`/admin/products?edit=${product.id}`)}>Düzenle</Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Ürün Bilgileri</TabsTrigger>
          <TabsTrigger value="variations">Varyasyonlar</TabsTrigger>
          <TabsTrigger value="images">Görseller</TabsTrigger>
        </TabsList>

        {/* Ürün Bilgileri */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Ürün Detayları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Temel Bilgiler</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-500">Ürün Adı</Label>
                      <p className="font-medium">{product.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Fiyat</Label>
                      <p className="font-medium">
                        {new Intl.NumberFormat('tr-TR', {
                          style: 'currency',
                          currency: 'TRY',
                        }).format(Number(product.price))}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Stok</Label>
                      <p className="font-medium">{product.stock}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Kategori</Label>
                      <p className="font-medium">{product.category?.name || 'Kategori Yok'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Marka</Label>
                      <p className="font-medium">{product.brand?.name || 'Marka Yok'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Öne Çıkan</Label>
                      <p className="font-medium">{product.featured ? 'Evet' : 'Hayır'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">SEO Bilgileri</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-500">URL Slug</Label>
                      <p className="font-medium">{product.slug}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Meta Başlık</Label>
                      <p className="font-medium">{product.metaTitle || 'Belirtilmemiş'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Meta Açıklama</Label>
                      <p className="font-medium">{product.metaDescription || 'Belirtilmemiş'}</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium mb-4">Açıklama</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="whitespace-pre-wrap">{product.description || 'Açıklama yok'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Varyasyonlar */}
        <TabsContent value="variations">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Yeni Varyasyon Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={newVariation.sku}
                    onChange={e => setNewVariation({ ...newVariation, sku: e.target.value })}
                    placeholder="Örn: PROD-VAR-001"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Fiyat</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newVariation.price}
                    onChange={e =>
                      setNewVariation({ ...newVariation, price: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stok</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={newVariation.stock}
                    onChange={e =>
                      setNewVariation({ ...newVariation, stock: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              {optionTypes.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Varyasyon Seçenekleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {optionTypes.map(optionType => (
                      <div key={optionType.id}>
                        <Label htmlFor={`option-${optionType.id}`}>{optionType.name}</Label>
                        <Input
                          id={`option-${optionType.id}`}
                          placeholder={`${optionType.name} değeri`}
                          onChange={e => handleOptionChange(optionType.id, e.target.value)}
                          value={
                            newVariation.options.find(opt => opt.optionTypeId === optionType.id)
                              ?.value || ''
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={handleAddVariation}>Varyasyon Ekle</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mevcut Varyasyonlar</CardTitle>
            </CardHeader>
            <CardContent>
              {product.variations.length === 0 ? (
                <p className="text-gray-500">Henüz varyasyon bulunmuyor.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Seçenekler
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fiyat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stok
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {product.variations.map(variation => (
                        <tr key={variation.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{variation.sku}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {variation.options.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {variation.options.map(option => (
                                    <span
                                      key={option.id}
                                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                      {option.optionType.name}: {option.value}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-500">Varsayılan</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Intl.NumberFormat('tr-TR', {
                                style: 'currency',
                                currency: 'TRY',
                              }).format(Number(variation.price))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{variation.stock}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteVariation(variation.id)}
                            >
                              Sil
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Görseller */}
        <TabsContent value="images">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Yeni Görsel Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="imageUrl">Görsel URL</Label>
                  <Input
                    id="imageUrl"
                    value={newImage.url}
                    onChange={handleImagePreview}
                    placeholder="https://example.com/image.jpg"
                  />
                  <div className="flex items-center mt-2">
                    <Checkbox
                      id="isMain"
                      checked={newImage.isMain}
                      onCheckedChange={checked =>
                        setNewImage({ ...newImage, isMain: checked === true })
                      }
                    />
                    <Label htmlFor="isMain" className="ml-2">
                      Ana görsel olarak ayarla
                    </Label>
                  </div>
                </div>
                <div>
                  <Label>Önizleme</Label>
                  <div className="mt-2 border rounded-md overflow-hidden h-40 flex items-center justify-center bg-gray-100">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Görsel önizleme"
                        width={150}
                        height={150}
                        className="object-contain max-h-full"
                      />
                    ) : (
                      <span className="text-gray-400">Görsel URL girin</span>
                    )}
                  </div>
                </div>
              </div>
              <Button onClick={handleAddImage}>Görsel Ekle</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mevcut Görseller</CardTitle>
            </CardHeader>
            <CardContent>
              {product.images.length === 0 ? (
                <p className="text-gray-500">Henüz görsel bulunmuyor.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {product.images.map(image => (
                    <div
                      key={image.id}
                      className={`border rounded-md overflow-hidden relative ${
                        image.isMain ? 'ring-2 ring-indigo-500' : ''
                      }`}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={image.url}
                          alt={`${product.name} görseli`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2 bg-white">
                        <div className="flex justify-between items-center">
                          {image.isMain ? (
                            <span className="text-xs font-medium text-indigo-600">Ana Görsel</span>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetMainImage(image.id)}
                              className="text-xs"
                            >
                              Ana görsel yap
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteImage(image.id)}
                            className="text-xs"
                          >
                            Sil
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
