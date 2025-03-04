'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product, Category, ProductImage, Brand } from '@prisma/client';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';
import { PaginatedResult, ProductFilter, productService } from '@/services/product-service';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';

// Ürün formu için arayüz
interface ProductFormData {
  name: string;
  price: number;
  image: string;
  categoryId: string;
  description: string;
  stock: number;
  featured?: boolean;
  brandId?: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
}

// Ürün listesi bileşeni (Single Responsibility Principle)
const ProductList = ({
  products,
  onDelete,
  onEdit,
  onViewDetails,
}: {
  products: (Product & {
    category?: { name: string };
    brand?: { name: string };
    images?: ProductImage[];
  })[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onViewDetails: (id: string) => void;
}) => {
  return (
    <div className=" rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ürün
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kategori
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Marka
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Stok
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className=" divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image
                        className="h-10 w-10 rounded-md object-cover"
                        src={
                          product.images?.find(img => img.isMain)?.url ||
                          'https://via.placeholder.com/300'
                        }
                        alt={product.name}
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">
                        {product.price.toLocaleString('tr-TR', {
                          style: 'currency',
                          currency: 'TRY',
                        })}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.category?.name || 'Kategori Yok'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.brand?.name || 'Marka Yok'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`text-sm ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}
                  >
                    {product.stock !== undefined ? product.stock : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => onEdit(product.id)}
                  >
                    Düzenle
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(product.id)}>
                    Sil
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() => onViewDetails(product.id)}
                  >
                    Detaylar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Ürün ekleme/düzenleme adımları
enum ProductFormStep {
  BASIC_INFO = 'Temel Bilgiler',
  IMAGES = 'Ürün Görselleri',
  SEO = 'SEO Bilgileri',
  VARIANTS = 'Varyasyonlar',
  REVIEW = 'Önizleme',
}

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

// Sayfalama bileşeni (Single Responsibility Principle)
const ProductPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  // Sayfa numaralarını oluştur
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Toplam sayfa sayısı az ise tüm sayfaları göster
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Toplam sayfa sayısı çok ise akıllı sayfalama yap
      pages.push(1); // İlk sayfa her zaman görünür

      if (currentPage > 3) {
        pages.push(null); // Ellipsis
      }

      // Mevcut sayfanın etrafındaki sayfaları göster
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push(null); // Ellipsis
      }

      pages.push(totalPages); // Son sayfa her zaman görünür
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={e => {
                e.preventDefault();
                onPageChange(currentPage - 1);
              }}
            />
          </PaginationItem>
        )}

        {pageNumbers.map((page, index) =>
          page === null ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={e => {
                  e.preventDefault();
                  onPageChange(page as number);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={e => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

// Checkbox onCheckedChange için tip tanımı
type CheckedState = boolean | 'indeterminate';

// Ana sayfa bileşeni
export default function ProductsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<
    PaginatedResult<
      Product & {
        category?: { name: string };
        brand?: { name: string };
        images?: ProductImage[];
      }
    >
  >({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<
    (Product & { images?: ProductImage[] }) | null
  >(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  // Kategorileri getir
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        toast({
          title: 'Hata',
          description: 'Kategoriler yüklenirken bir hata oluştu.',
          variant: 'destructive',
        });
      }
    };

    fetchCategories();
  }, [toast]);

  // Markaları getir
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/admin/brands');
        if (response.ok) {
          const data = await response.json();
          setBrands(data);
        }
      } catch (error) {
        toast({
          title: 'Hata',
          description: 'Markalar yüklenirken bir hata oluştu.',
          variant: 'destructive',
        });
      }
    };

    fetchBrands();
  }, [toast]);

  // Ürünleri getir
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const filter: ProductFilter = {};

      if (searchTerm) {
        filter.name = searchTerm;
      }

      if (categoryFilter && categoryFilter !== 'ALL') {
        filter.category = categoryFilter as string;
      }

      const result = await productService.getPaginatedProducts(
        currentPage,
        itemsPerPage,
        filter,
        sortBy,
        sortOrder
      );

      setProducts(result);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Ürünler yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, categoryFilter, sortBy, sortOrder, toast]);

  // Sayfa yüklendiğinde verileri getir
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Arama işlemi
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Arama yapıldığında ilk sayfaya dön
  };

  // Sayfa değiştirme
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Sıralama değiştirme
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      // Aynı alan seçildiğinde sıralama yönünü değiştir
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Farklı alan seçildiğinde varsayılan olarak azalan sıralama
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1); // Sıralama değiştiğinde ilk sayfaya dön
  };

  // Ürün silme
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      try {
        await productService.deleteProduct(id);
        toast({
          title: 'Başarılı',
          description: 'Ürün başarıyla silindi.',
        });
        fetchProducts();
      } catch (error) {
        toast({
          title: 'Hata',
          description: 'Ürün silinirken bir hata oluştu.',
          variant: 'destructive',
        });
      }
    }
  };

  // Ürün düzenleme
  const handleEditProduct = (id: string) => {
    const product = products.data.find(p => p.id === id);
    if (product) {
      setEditingProduct(product);
      setShowForm(true);
    }
  };

  // Ürün detaylarını görüntüleme
  const handleViewProductDetails = (id: string) => {
    router.push(`/admin/products/${id}`);
  };

  // Ürün ekleme/güncelleme
  const handleSubmitProduct = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        // Ürün güncelleme
        await productService.updateProduct(editingProduct.id, {
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          featured: data.featured,
          categoryId: data.categoryId,
          brandId: data.brandId || '',
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          slug: data.slug,
        });

        // Eğer yeni bir görsel yüklendiyse
        if (
          data.image &&
          (!editingProduct.images || !editingProduct.images.some(img => img.url === data.image))
        ) {
          // Mevcut ana görseli bul
          const mainImage = editingProduct.images?.find(img => img.isMain);

          if (mainImage) {
            // Mevcut ana görseli güncelle
            await productService.updateProductImage(mainImage.id, {
              url: data.image,
              isMain: true,
            });
          } else {
            // Yeni ana görsel ekle
            await productService.addProductImage(editingProduct.id, {
              url: data.image,
              isMain: true,
            });
          }
        }

        toast({
          title: 'Başarılı',
          description: 'Ürün başarıyla güncellendi.',
        });
      } else {
        // Yeni ürün ekleme
        const newProduct = await productService.createProduct({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          featured: data.featured,
          categoryId: data.categoryId,
          brandId: data.brandId || '',
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          slug: data.slug,
          images: data.image ? [{ url: data.image, isMain: true }] : [],
        });

        toast({
          title: 'Başarılı',
          description: 'Ürün başarıyla eklendi.',
        });
      }

      // Formu kapat ve ürünleri yeniden yükle
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Ürün kaydedilirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  // Ürün formunu göster
  const getProductFormData = (
    product: (Product & { images?: ProductImage[] }) | null
  ): ProductFormData => {
    if (product) {
      return {
        name: product.name,
        price: product.price,
        image: product.images?.find(img => img.isMain)?.url || '',
        categoryId: product.categoryId,
        description: product.description || '',
        stock: product.stock,
        featured: product.featured,
        brandId: product.brandId,
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
        slug: product.slug,
      };
    }

    return {
      name: '',
      price: 0,
      image: '',
      categoryId: '',
      description: '',
      stock: 0,
      featured: false,
      brandId: '',
      metaTitle: '',
      metaDescription: '',
      slug: '',
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ürünler</h1>

      {/* Ürün formu */}
      {showForm && (
        <ProductForm
          product={getProductFormData(editingProduct)}
          categories={categories}
          brands={brands}
          onSubmit={handleSubmitProduct}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Ürün listesi */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <Input
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-md"
          />
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
        >
          Yeni Ürün Ekle
        </Button>
      </div>

      {/* Ürün listesi */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <ProductList
            products={products.data}
            onDelete={handleDeleteProduct}
            onEdit={handleEditProduct}
            onViewDetails={handleViewProductDetails}
          />

          {/* Sayfalama */}
          <div className="mt-6">
            <ProductPagination
              currentPage={products.page}
              totalPages={products.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
