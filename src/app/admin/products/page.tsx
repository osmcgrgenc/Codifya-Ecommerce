'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product, Category } from '@prisma/client';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious, 
  PaginationEllipsis 
} from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';
import { PaginatedResult, ProductFilter, productService } from '@/services/product-service';
import { useRouter } from 'next/navigation';

// Ürün formu için arayüz
interface ProductFormData {
  name: string;
  price: number;
  image: string;
  categoryId: string;
  description: string;
  stock: number;
  featured?: boolean;
}

// Ürün listesi bileşeni (Single Responsibility Principle)
const ProductList = ({ 
  products, 
  onDelete, 
  onEdit,
  onViewDetails
}: { 
  products: (Product & { category?: { name: string } })[], 
  onDelete: (id: string) => void, 
  onEdit: (id: string) => void,
  onViewDetails: (id: string) => void
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
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
                Fiyat
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Stok
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Öne Çıkan
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image
                        className="h-10 w-10 rounded-md object-cover"
                        src={product.image || 'https://via.placeholder.com/300'}
                        alt={product.name}
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.category?.name || 'Kategori Yok'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.price.toLocaleString('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {product.stock !== undefined ? product.stock : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm">
                    {product.featured ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Evet
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Hayır
                      </span>
                    )}
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
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                  >
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

// Ürün formu bileşeni (Single Responsibility Principle)
const ProductForm = ({ 
  product, 
  categories, 
  onSubmit, 
  onCancel 
}: { 
  product: ProductFormData, 
  categories: Category[], 
  onSubmit: (data: ProductFormData) => void, 
  onCancel: () => void 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProductFormData>(product);

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || formData.price <= 0) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun.",
        variant: "destructive"
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Ürün {product.name ? 'Düzenle' : 'Ekle'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Ürün Adı</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="category">Kategori</Label>
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
              <Label htmlFor="price">Fiyat (₺)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={e => handleChange('price', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="stock">Stok Adedi</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock || 0}
                onChange={e => handleChange('stock', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="image">Görsel URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={e => handleChange('image', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="featured">Öne Çıkan Ürün</Label>
              <Select 
                value={formData.featured ? "true" : "false"} 
                onValueChange={value => handleChange('featured', value === "true")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Öne çıkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Evet</SelectItem>
                  <SelectItem value="false">Hayır</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Ürün Açıklaması</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={e => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              İptal
            </Button>
            <Button type="submit">
              {product.name ? 'Güncelle' : 'Ekle'}
            </Button>
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
  onPageChange 
}: { 
  currentPage: number, 
  totalPages: number, 
  onPageChange: (page: number) => void 
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
            <PaginationPrevious href="#" onClick={(e) => {
              e.preventDefault();
              onPageChange(currentPage - 1);
            }} />
          </PaginationItem>
        )}
        
        {pageNumbers.map((page, index) => (
          page === null ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink 
                href="#" 
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page as number);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        ))}
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href="#" onClick={(e) => {
              e.preventDefault();
              onPageChange(currentPage + 1);
            }} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

// Ana sayfa bileşeni
export default function ProductsPage() {
  const { toast } = useToast();
  const router = useRouter();
  
  // State tanımlamaları
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  // Boş ürün formu
  const emptyProductForm: ProductFormData = {
    name: '',
    price: 0,
    image: 'https://via.placeholder.com/300',
    categoryId: '',
    description: '',
    stock: 0,
    featured: false,
  };

  // Ürünleri yükle (Open/Closed Principle - yeni filtreler eklenebilir)
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Filtreleri oluştur
      const filters: ProductFilter = {};
      
      if (searchTerm) {
        filters.name = searchTerm;
      }
      
      if (categoryFilter !== 'ALL') {
        filters.category = categoryFilter;
      }
      
      // Ürün servisini kullanarak ürünleri getir
      const result = await productService.getPaginatedProducts(
        currentPage,
        itemsPerPage,
        filters,
        sortBy,
        sortOrder
      );
      
      setProducts(result.data);
      setTotalPages(result.totalPages);
      setTotalItems(result.total);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
      toast({
        title: "Hata",
        description: "Ürünler yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, categoryFilter, sortBy, sortOrder, toast]);

  // Kategorileri yükle
  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/categories');
      
      if (!response.ok) {
        throw new Error('Kategoriler yüklenirken bir hata oluştu');
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
      toast({
        title: "Hata",
        description: "Kategoriler yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Sayfa yüklendiğinde verileri getir
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Ürün silme işlemi
  const handleDeleteProduct = async (id: string) => {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await productService.deleteProduct(id);
        
        // Başarılı silme işlemi sonrası ürünleri yeniden yükle
        loadProducts();
        
        toast({
          title: "Başarılı",
          description: "Ürün başarıyla silindi.",
        });
      } catch (error) {
        console.error('Ürün silinirken hata:', error);
        toast({
          title: "Hata",
          description: "Ürün silinirken bir hata oluştu.",
          variant: "destructive"
        });
      }
    }
  };

  // Ürün düzenleme işlemi
  const handleEditProduct = async (id: string) => {
    try {
      const product = await productService.getProductById(id);
      
      if (!product) {
        throw new Error('Ürün bulunamadı');
      }
      
      setEditingProduct(product);
      setShowForm(true);
    } catch (error) {
      console.error('Ürün bilgileri alınırken hata:', error);
      toast({
        title: "Hata",
        description: "Ürün bilgileri alınırken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  // Ürün detaylarını görüntüleme
  const handleViewProductDetails = (id: string) => {
    router.push(`/admin/products/${id}`);
  };

  // Ürün ekleme/güncelleme işlemi
  const handleSubmitProduct = async (formData: ProductFormData) => {
    try {
      if (editingProduct) {
        // Ürün güncelleme
        await productService.updateProduct(editingProduct.id, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          image: formData.image,
          categoryId: formData.categoryId,
          stock: formData.stock,
          featured: formData.featured,
        });
      } else {
        // Yeni ürün ekleme
        await productService.createProduct({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          image: formData.image,
          categoryId: formData.categoryId,
          stock: formData.stock,
          featured: formData.featured,
        });
      }
      
      // Başarılı işlem sonrası formu kapat ve ürünleri yeniden yükle
      setShowForm(false);
      setEditingProduct(null);
      loadProducts();
      
      toast({
        title: "Başarılı",
        description: editingProduct 
          ? "Ürün başarıyla güncellendi." 
          : "Ürün başarıyla eklendi.",
      });
    } catch (error) {
      console.error('Ürün kaydedilirken hata:', error);
      toast({
        title: "Hata",
        description: "Ürün kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  // Arama işlemi
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Arama yapıldığında ilk sayfaya dön
  };

  // Sayfa değiştirme işlemi
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

  // Düzenleme için ürün formunu hazırla
  const getProductFormData = (product: Product | null): ProductFormData => {
    if (!product) return emptyProductForm;
    
    return {
      name: product.name,
      price: product.price,
      image: product.image || 'https://via.placeholder.com/300',
      categoryId: product.categoryId,
      description: product.description || '',
      stock: product.stock,
      featured: product.featured,
    };
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ürünler</h1>
        <Button onClick={() => {
          setShowForm(!showForm);
          setEditingProduct(null);
        }}>
          {showForm && !editingProduct ? 'İptal' : 'Yeni Ürün Ekle'}
        </Button>
      </div>

      {showForm && (
        <ProductForm 
          product={getProductFormData(editingProduct)}
          categories={categories}
          onSubmit={handleSubmitProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
        <Input
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-md"
        />
        
        <Select
          value={categoryFilter}
          onValueChange={(value: string) => {
            setCategoryFilter(value);
            setCurrentPage(1); // Kategori değiştiğinde ilk sayfaya dön
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Kategori Filtresi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tüm Kategoriler</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={sortBy}
          onValueChange={(value: string) => handleSortChange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sıralama" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Eklenme Tarihi</SelectItem>
            <SelectItem value="name">Ürün Adı</SelectItem>
            <SelectItem value="price">Fiyat</SelectItem>
            <SelectItem value="stock">Stok</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={sortOrder}
          onValueChange={(value: 'asc' | 'desc') => {
            setSortOrder(value);
            setCurrentPage(1); // Sıralama yönü değiştiğinde ilk sayfaya dön
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sıralama Yönü" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Artan</SelectItem>
            <SelectItem value="desc">Azalan</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          className="ml-auto"
          onClick={() => {
            setSearchTerm('');
            setCategoryFilter('ALL');
            setSortBy('createdAt');
            setSortOrder('desc');
            setCurrentPage(1);
          }}
        >
          Filtreleri Sıfırla
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : products.length > 0 ? (
        <>
          <ProductList 
            products={products} 
            onDelete={handleDeleteProduct} 
            onEdit={handleEditProduct}
            onViewDetails={handleViewProductDetails}
          />
          
          <div className="mt-4 text-sm text-gray-500 text-center">
            Toplam {totalItems} ürün, {totalPages} sayfa
          </div>
          
          <ProductPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h2 className="text-xl font-medium mb-2">Ürün bulunamadı</h2>
          <p className="text-gray-500">
            {searchTerm || categoryFilter !== 'ALL'
              ? `Arama kriterlerinize uygun ürün bulunamadı.` 
              : 'Henüz ürün bulunmuyor.'}
          </p>
          {(searchTerm || categoryFilter !== 'ALL') && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('ALL');
                setCurrentPage(1);
              }}
            >
              Filtreleri Temizle
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
