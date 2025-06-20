'use client';

import { useState, useCallback, useEffect } from 'react';
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

interface ProductListClientProps {
  initialProducts: PaginatedResult<
    Product & {
      category?: { name: string };
      brand?: { name: string };
      images?: ProductImage[];
    }
  >;
  initialCategories: Category[];
  initialBrands: Brand[];
  initialPage: number;
  initialLimit: number;
  initialSearch: string;
  initialCategory: string;
  initialSortBy: string;
  initialSortOrder: 'asc' | 'desc';
}

export default function ProductListClient({
  initialProducts,
  initialCategories,
  initialBrands,
  initialPage,
  initialLimit,
  initialSearch,
  initialCategory,
  initialSortBy,
  initialSortOrder,
}: ProductListClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<
    PaginatedResult<
      Product & {
        category?: { name: string };
        brand?: { name: string };
        images?: ProductImage[];
      }
    >
  >(initialProducts);

  const [categories] = useState<Category[]>(initialCategories);
  const [brands] = useState<Brand[]>(initialBrands);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<
    (Product & { images?: ProductImage[] }) | null
  >(null);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);
  const itemsPerPage = initialLimit;

  // URL'yi güncelle
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage !== 1) params.set('page', currentPage.toString());
    if (itemsPerPage !== 10) params.set('limit', itemsPerPage.toString());
    if (searchTerm) params.set('search', searchTerm);
    if (categoryFilter !== 'ALL') params.set('category', categoryFilter);
    if (sortBy !== 'createdAt') params.set('sortBy', sortBy);
    if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);

    const url = `/admin/products${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', url);
  }, [currentPage, itemsPerPage, searchTerm, categoryFilter, sortBy, sortOrder]);

  // Toast mesajları için fonksiyonlar
  const showSuccess = useCallback(
    (message: string) => {
      toast({
        title: 'Başarılı',
        description: message,
      });
    },
    [toast]
  );

  const showError = useCallback(
    (message: string) => {
      toast({
        title: 'Hata',
        description: message,
        variant: 'destructive',
      });
    },
    [toast]
  );

  // Ürünleri getir
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
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

      // Sonucun doğru formatta olduğundan emin ol
      if (result && result.data && Array.isArray(result.data)) {
        setProducts({
          data: result.data,
          total: result.total || 0,
          page: result.page || currentPage,
          limit: result.limit || itemsPerPage,
          totalPages: result.totalPages || 1,
        });
      } else if (result && typeof result === 'object' && 'data' in result) {
        // API yanıtı bir üst katmanda olabilir
        const apiResponse = result as any;

        if (apiResponse.data && typeof apiResponse.data === 'object') {
          const paginatedData = apiResponse.data;

          if (Array.isArray(paginatedData.data)) {
            setProducts({
              data: paginatedData.data,
              total: paginatedData.total || 0,
              page: paginatedData.page || currentPage,
              limit: paginatedData.limit || itemsPerPage,
              totalPages: paginatedData.totalPages || 1,
            });
          } else {
            setProducts({
              data: [],
              total: 0,
              page: currentPage,
              limit: itemsPerPage,
              totalPages: 0,
            });
            showError('Ürün verisi beklenen formatta değil.');
          }
        } else {
          setProducts({
            data: [],
            total: 0,
            page: currentPage,
            limit: itemsPerPage,
            totalPages: 0,
          });
          showError('Ürün verisi beklenen formatta değil.');
        }
      } else {
        // Varsayılan boş bir sonuç oluştur
        setProducts({
          data: [],
          total: 0,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: 0,
        });
        showError('Ürün verisi beklenen formatta değil.');
      }
    } catch (error) {
      showError('Ürünler yüklenirken bir hata oluştu.');
      // Hata durumunda boş bir sonuç oluştur
      setProducts({
        data: [],
        total: 0,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, categoryFilter, sortBy, sortOrder, itemsPerPage, showError]);

  // Filtreleme veya sayfalama değiştiğinde ürünleri yeniden getir
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Arama işlemi
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (loading) return;
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    },
    [loading]
  );

  // Sayfa değiştirme
  const handlePageChange = useCallback(
    (page: number) => {
      if (loading || page === currentPage) return;
      setCurrentPage(page);
    },
    [loading, currentPage]
  );

  // Sıralama değiştirme
  const handleSortChange = useCallback(
    (field: string) => {
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
    },
    [loading, sortBy]
  );

  // Ürün silme
  const handleDeleteProduct = useCallback(
    async (id: string) => {
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
    },
    [loading, showSuccess, showError, fetchProducts]
  );

  // Ürün düzenleme
  const handleEditProduct = useCallback(
    (id: string) => {
      if (loading) return;

      const product = products.data.find(
        (
          p: Product & {
            category?: { name: string };
            brand?: { name: string };
            images?: ProductImage[];
          }
        ) => p.id === id
      );
      if (product) {
        setEditingProduct(product);
        setShowForm(true);
      }
    },
    [loading, products.data]
  );

  // Ürün detaylarını görüntüleme
  const handleViewProductDetails = useCallback(
    (id: string) => {
      router.push(`/admin/products/${id}`);
    },
    [router]
  );

  // Ürün ekleme/güncelleme
  const handleSubmitProduct = useCallback(
    async (data: ProductFormData) => {
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
          console.log('data', data);
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
    },
    [loading, editingProduct, showSuccess, showError, fetchProducts]
  );

  // Ürün formunu göster
  const productFormData = editingProduct
    ? {
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
      }
    : {
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

  return (
    <>
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
    </>
  );
}
