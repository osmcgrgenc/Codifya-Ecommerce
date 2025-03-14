'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product, Category, ProductImage, Brand } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';
import { PaginatedResult, ProductFilter, productService } from '@/services/product';
import { useRouter } from 'next/navigation';

import ProductList from '@/components/admin/products/ProductList';
import ProductForm from '@/components/admin/products/ProductForm';
import ProductPagination from '@/components/admin/products/ProductPagination';
import { ProductFormData } from '@/types/product';

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
  
  // Toast mesajları için memoize edilmiş fonksiyonlar
  const showSuccess = useCallback((message: string) => {
    toast({
      title: 'Başarılı',
      description: message,
    });
  }, [toast]);

  const showError = useCallback((message: string) => {
    toast({
      title: 'Hata',
      description: message,
      variant: 'destructive',
    });
  }, [toast]);

  // Kategorileri ve markaları getir - useCallback ile optimize edildi
  const fetchCategoriesAndBrands = useCallback(async () => {
    console.log('fetchCategoriesAndBrands başladı', {
      categoriesLength: categories.length,
      brandsLength: brands.length
    });
    
    if (categories.length > 0 && brands.length > 0) {
      console.log('Kategoriler ve markalar zaten yüklü, işlem atlanıyor');
      return;
    }
    
    console.log('Kategoriler ve markalar getiriliyor...');
    
    try {
      const [categoriesResponse, brandsResponse] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/brands')
      ]);

      console.log('API yanıtları alındı', {
        categoriesStatus: categoriesResponse.status,
        brandsStatus: brandsResponse.status
      });

      if (categoriesResponse.ok && brandsResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        const brandsData = await brandsResponse.json();
        
        console.log('Veriler başarıyla alındı', {
          categoriesCount: categoriesData.data?.length || 0,
          brandsCount: brandsData.data?.length || 0
        });
        
        setCategories(categoriesData.data || []);
        setBrands(brandsData.data || []);
        setLoading(false);
      } else {
        console.error('API yanıtları başarısız', {
          categoriesStatus: categoriesResponse.status,
          brandsStatus: brandsResponse.status
        });
        showError('Veriler yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Kategoriler ve markalar getirilirken hata:', error);
      showError('Veriler yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  }, [categories.length, brands.length, showError]);

  // Ürünleri getir - useCallback ile optimize edildi
  const fetchProducts = useCallback(async () => {
    if (loading && categories.length === 0) return;
    
    setLoading(true);
    try {
      console.log('Ürünler getiriliyor...', {
        currentPage,
        itemsPerPage,
        searchTerm,
        categoryFilter
      });
      
      const filter: ProductFilter = {};

      if (searchTerm) {
        filter.name = searchTerm;
      }

      if (categoryFilter && categoryFilter !== 'ALL') {
        filter.category = categoryFilter;
      }

      const result = await productService.getPaginatedProducts(
        currentPage,
        itemsPerPage,
        filter,
        sortBy,
        sortOrder
      );
      
      console.log('Ürünler getirildi:', result);
      setProducts(result);
    } catch (error) {
      console.error('Ürünler yüklenirken bir hata oluştu:', error);
      showError('Ürünler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, categoryFilter, sortBy, sortOrder, showError, loading, categories.length, itemsPerPage]);

  // İlk yükleme
  useEffect(() => {
    console.log('İlk yükleme useEffect çalıştı');
    fetchCategoriesAndBrands();
  }, [fetchCategoriesAndBrands]);

  // Kategoriler ve markalar yüklendikten sonra ürünleri getir
  useEffect(() => {
    console.log('Kategoriler ve markalar useEffect çalıştı', {
      categoriesLength: categories.length,
      brandsLength: brands.length,
      loading
    });

    if (categories.length > 0 && brands.length > 0 && !loading) {
      console.log('Ürünler getiriliyor...');
      fetchProducts();
    }
  }, [fetchProducts, categories.length, brands.length, loading]);

  // Arama işlemi - debounce eklenebilir
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, [loading]);

  // Sayfa değiştirme
  const handlePageChange = useCallback((page: number) => {
    if (loading || page === currentPage) return;
    setCurrentPage(page);
  }, [loading, currentPage]);

  // Sıralama değiştirme
  const handleSortChange = useCallback((field: string) => {
    if (loading) return;
    
    setSortOrder(prev => {
      if (sortBy === field) {
        return prev === 'asc' ? 'desc' : 'asc';
      }
      return 'desc';
    });
    
    if (sortBy !== field) {
      setSortBy(field);
    }
    
    setCurrentPage(1);
  }, [loading, sortBy]);

  // Ürün silme
  const handleDeleteProduct = useCallback(async (id: string) => {
    if (loading) return;
    
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      try {
        setLoading(true);
        await productService.deleteProduct(id);
        showSuccess('Ürün başarıyla silindi.');
        fetchProducts();
      } catch (error) {
        showError('Ürün silinirken bir hata oluştu.');
        setLoading(false);
      }
    }
  }, [loading, showSuccess, showError, fetchProducts]);

  // Ürün düzenleme
  const handleEditProduct = useCallback((id: string) => {
    if (loading) return;
    
    const product = products.data.find((p: Product & { category?: { name: string }; brand?: { name: string }; images?: ProductImage[] }) => p.id === id);
    if (product) {
      setEditingProduct(product);
      setShowForm(true);
    }
  }, [loading, products.data]);

  // Ürün detaylarını görüntüleme
  const handleViewProductDetails = useCallback((id: string) => {
    router.push(`/admin/products/${id}`);
  }, [router]);

  // Ürün ekleme/güncelleme
  const handleSubmitProduct = useCallback(async (data: ProductFormData) => {
    if (loading) return;
    
    try {
      setLoading(true);
      
      if (editingProduct) {
        // Mevcut ürünü güncelle
        await productService.updateProduct(editingProduct.id, {
          name: data.name,
          description: data.description,
          price: data.price,
          categoryId: data.categoryId,
          brandId: data.brandId || '',
          stock: data.stock,
          featured: data.featured,
          slug: data.slug,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
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

        showSuccess('Ürün başarıyla güncellendi.');
      } else {
        // Yeni ürün oluştur
        await productService.createProduct({
          name: data.name,
          description: data.description,
          price: data.price,
          categoryId: data.categoryId,
          brandId: data.brandId || '',
          stock: data.stock,
          featured: data.featured,
          slug: data.slug,
          images: data.image ? [{ url: data.image, isMain: true }] : [],
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
        });

        showSuccess('Ürün başarıyla oluşturuldu.');
      }

      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      showError('Ürün kaydedilirken bir hata oluştu.');
      setLoading(false);
    }
  }, [loading, editingProduct, showSuccess, showError, fetchProducts]);

  // Ürün formunu göster - useMemo ile optimize edildi
  const productFormData = useMemo(() => {
    if (editingProduct) {
      return {
        name: editingProduct.name,
        price: editingProduct.price,
        image: editingProduct.images?.find(img => img.isMain)?.url || '',
        categoryId: editingProduct.categoryId,
        description: editingProduct.description || '',
        stock: editingProduct.stock,
        featured: editingProduct.featured,
        brandId: editingProduct.brandId,
        metaTitle: editingProduct.metaTitle || '',
        metaDescription: editingProduct.metaDescription || '',
        slug: editingProduct.slug,
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
  }, [editingProduct]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ürünler</h1>

      {/* Ürün formu */}
      {showForm && (
        <ProductForm
          product={productFormData}
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
          {products.totalPages > 1 && (
            <div className="mt-6">
              <ProductPagination
                currentPage={products.page}
                totalPages={products.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
