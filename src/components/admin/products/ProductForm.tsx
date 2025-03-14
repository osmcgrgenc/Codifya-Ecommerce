'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Category, Brand } from '@prisma/client';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductFormData, ProductFormStep, CheckedState } from '@/types/product';

// Ürün formu bileşeni (Single Responsibility Principle)
const ProductForm = ({
  product,
  categories,
  brands,
  onSubmit,
  onCancel,
}: {
  product: ProductFormData;
  categories: Category[];
  brands: Brand[];
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProductFormData>(product);
  const [currentStep, setCurrentStep] = useState<ProductFormStep>(ProductFormStep.BASIC_INFO);
  const [imagePreview, setImagePreview] = useState<string | null>(product.image || null);

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || !formData.brandId || formData.price <= 0) {
      toast({
        title: 'Hata',
        description: 'Lütfen tüm zorunlu alanları doldurun.',
        variant: 'destructive',
      });
      return;
    }
    onSubmit(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        handleChange('image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    // Adım doğrulaması
    if (currentStep === ProductFormStep.BASIC_INFO) {
      if (!formData.name || !formData.categoryId || !formData.brandId || formData.price <= 0) {
        toast({
          title: 'Hata',
          description: 'Lütfen tüm zorunlu alanları doldurun.',
          variant: 'destructive',
        });
        return;
      }
    }

    // Bir sonraki adıma geç
    const steps = Object.values(ProductFormStep);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps = Object.values(ProductFormStep);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Temel bilgiler adımı
  const renderBasicInfoStep = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Ürün Adı *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={e => handleChange('name', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Fiyat *</Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={e => handleChange('price', parseFloat(e.target.value))}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Kategori *</Label>
        <Select
          value={formData.categoryId}
          onValueChange={value => handleChange('categoryId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Kategori seçin" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="brand">Marka *</Label>
        <Select
          value={formData.brandId || ''}
          onValueChange={value => handleChange('brandId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Marka seçin" />
          </SelectTrigger>
          <SelectContent>
            {brands.map(brand => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={e => handleChange('description', e.target.value)}
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="stock">Stok</Label>
        <Input
          id="stock"
          type="number"
          min="0"
          step="1"
          value={formData.stock}
          onChange={e => handleChange('stock', parseInt(e.target.value))}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked: CheckedState) => handleChange('featured', checked)}
        />
        <Label htmlFor="featured">Öne Çıkan Ürün</Label>
      </div>
    </div>
  );

  // Ürün görselleri adımı
  const renderImagesStep = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image">Ana Ürün Görseli</Label>
        <div className="mt-2 flex items-center space-x-4">
          <div className="w-32 h-32 border rounded-md overflow-hidden">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Ürün görseli önizleme"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                Görsel Yok
              </div>
            )}
          </div>
          <div>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Önerilen boyut: 800x800px, maksimum dosya boyutu: 2MB
            </p>
          </div>
        </div>
      </div>
      {/* Ek görseller için buraya daha fazla alan eklenebilir */}
    </div>
  );

  // SEO bilgileri adımı
  const renderSeoStep = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="metaTitle">SEO Başlığı</Label>
        <Input
          id="metaTitle"
          value={formData.metaTitle || ''}
          onChange={e => handleChange('metaTitle', e.target.value)}
          placeholder="SEO için sayfa başlığı"
        />
        <p className="text-xs text-gray-500 mt-1">Önerilen uzunluk: 50-60 karakter</p>
      </div>
      <div>
        <Label htmlFor="metaDescription">SEO Açıklaması</Label>
        <Textarea
          id="metaDescription"
          value={formData.metaDescription || ''}
          onChange={e => handleChange('metaDescription', e.target.value)}
          placeholder="SEO için sayfa açıklaması"
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">Önerilen uzunluk: 150-160 karakter</p>
      </div>
      <div>
        <Label htmlFor="slug">URL Slug</Label>
        <Input
          id="slug"
          value={formData.slug || ''}
          onChange={e => handleChange('slug', e.target.value)}
          placeholder="urun-adi-seo-dostu"
        />
        <p className="text-xs text-gray-500 mt-1">
          Boş bırakırsanız, ürün adından otomatik oluşturulacaktır.
        </p>
      </div>
    </div>
  );

  // Varyasyonlar adımı
  const renderVariantsStep = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-700">
          Ürün kaydedildikten sonra varyasyonları düzenleyebilirsiniz. Şu anda varsayılan bir
          varyasyon otomatik olarak oluşturulacaktır.
        </p>
      </div>
      <div>
        <Label htmlFor="defaultStock">Varsayılan Varyasyon Stok Miktarı</Label>
        <Input
          id="defaultStock"
          type="number"
          min="0"
          step="1"
          value={formData.stock}
          onChange={e => handleChange('stock', parseInt(e.target.value))}
        />
      </div>
    </div>
  );

  // Önizleme adımı
  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Temel Bilgiler</h3>
          <div className="mt-2 space-y-2">
            <p>
              <span className="font-medium">Ürün Adı:</span> {formData.name}
            </p>
            <p>
              <span className="font-medium">Fiyat:</span>{' '}
              {formData.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </p>
            <p>
              <span className="font-medium">Kategori:</span>{' '}
              {categories.find(c => c.id === formData.categoryId)?.name}
            </p>
            <p>
              <span className="font-medium">Marka:</span>{' '}
              {brands.find(b => b.id === formData.brandId)?.name}
            </p>
            <p>
              <span className="font-medium">Stok:</span> {formData.stock}
            </p>
            <p>
              <span className="font-medium">Öne Çıkan:</span> {formData.featured ? 'Evet' : 'Hayır'}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Görsel</h3>
          <div className="mt-2">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Ürün görseli önizleme"
                width={200}
                height={200}
                className="rounded-md object-cover"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center bg-gray-100 text-gray-400 rounded-md">
                Görsel Yok
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">Açıklama</h3>
        <p className="mt-2 text-sm text-gray-700">{formData.description || 'Açıklama yok'}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">SEO Bilgileri</h3>
        <div className="mt-2 space-y-2">
          <p>
            <span className="font-medium">SEO Başlığı:</span>{' '}
            {formData.metaTitle || 'Belirtilmemiş'}
          </p>
          <p>
            <span className="font-medium">SEO Açıklaması:</span>{' '}
            {formData.metaDescription || 'Belirtilmemiş'}
          </p>
          <p>
            <span className="font-medium">URL Slug:</span>{' '}
            {formData.slug || 'Otomatik oluşturulacak'}
          </p>
        </div>
      </div>
    </div>
  );

  // Adıma göre içerik render et
  const renderStepContent = () => {
    switch (currentStep) {
      case ProductFormStep.BASIC_INFO:
        return renderBasicInfoStep();
      case ProductFormStep.IMAGES:
        return renderImagesStep();
      case ProductFormStep.SEO:
        return renderSeoStep();
      case ProductFormStep.VARIANTS:
        return renderVariantsStep();
      case ProductFormStep.REVIEW:
        return renderReviewStep();
      default:
        return null;
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Ürün {product.name ? 'Düzenle' : 'Ekle'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between border-b pb-4">
            {Object.values(ProductFormStep).map((step, index) => (
              <button
                key={step}
                type="button"
                className={`text-sm font-medium ${
                  currentStep === step
                    ? 'text-indigo-600 border-b-2 border-indigo-600 -mb-4'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setCurrentStep(step)}
              >
                {index + 1}. {step}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === ProductFormStep.BASIC_INFO ? onCancel : prevStep}
            >
              {currentStep === ProductFormStep.BASIC_INFO ? 'İptal' : 'Geri'}
            </Button>
            <div>
              {currentStep === ProductFormStep.REVIEW ? (
                <Button type="submit">Kaydet</Button>
              ) : (
                <Button type="button" onClick={nextStep}>
                  İleri
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm; 