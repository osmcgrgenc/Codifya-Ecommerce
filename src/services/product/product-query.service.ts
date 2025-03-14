import { db } from '@/lib/db';
import { convertDecimalToNumber } from '@/lib/utils';
import { 
  ProductWithRelations, 
  PaginatedResult, 
  ProductFilter,
  ProductListItem
} from './types';
import { 
  isClient, 
  calculateTotalStock, 
  transformProductData, 
  buildProductQuery,
  productIncludes,
  handleServiceError
} from './utils';

/**
 * Ürün sorgulama servisi
 * Ürünleri getirme, filtreleme ve arama işlemlerini yönetir
 */
export const productQueryService = {
  /**
   * Tüm ürünleri getirir
   * @returns Ürün listesi
   */
  async getAllProducts(): Promise<ProductWithRelations[]> {
    if (isClient()) {
      return []; // Tarayıcı tarafında boş dizi döndür
    }

    try {
      const products = await db.product.findMany({
        include: productIncludes,
      });

      // Her ürün için toplam stok değerini hesapla
      return products.map(transformProductData);
    } catch (error) {
      console.error('Tüm ürünler getirilirken hata oluştu:', error);
      return [];
    }
  },

  /**
   * Sayfalanmış ve filtrelenmiş ürünleri getirir
   * @param page - Sayfa numarası
   * @param limit - Sayfa başına ürün sayısı
   * @param filters - Filtreleme seçenekleri
   * @param sortBy - Sıralama alanı
   * @param sortOrder - Sıralama yönü
   * @returns Sayfalanmış ürün sonuçları
   */
  async getPaginatedProducts(
    page: number = 1,
    limit: number = 10,
    filters?: ProductFilter,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResult<ProductWithRelations>> {
    try {
      // Sayfalama için hesaplamalar
      const skip = (page - 1) * limit;

      // Filtreleme koşullarını oluştur
      const where = buildProductQuery(filters);

      // Sıralama seçeneklerini oluştur
      const orderBy: any = {};
      orderBy[sortBy] = sortOrder;

      // Client-side rendering'de API çağrısı yapılmalı
      if (isClient()) {
        try {
          // API endpoint'e istek gönder
          const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            sortBy,
            sortOrder
          });
          
          // Filtreleri ekle
          if (filters?.name) queryParams.append('name', filters.name);
          if (filters?.category) queryParams.append('category', filters.category);
          if (filters?.brand) queryParams.append('brand', filters.brand);
          if (filters?.featured !== undefined) queryParams.append('featured', filters.featured.toString());
          if (filters?.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice.toString());
          if (filters?.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice.toString());
          
          const response = await fetch(`/api/products?${queryParams.toString()}`);
          if (!response.ok) throw new Error('API isteği başarısız oldu');
          
          return await response.json();
        } catch (error) {
          console.error('Client-side ürün getirme hatası:', error);
          return {
            data: [],
            total: 0,
            page,
            limit,
            totalPages: 0,
          };
        }
      }

      // Server-side rendering için devam et
      // Toplam ürün sayısını al
      let total = 0;
      
      if (Object.keys(where).length > 0) {
        total = await db.product.count({ where });
      } else {
        try { 
          total = await db.product.count();
        } catch (error) {
          console.error('Ürün sayısı alınırken hata oluştu:', error);
          total = 0;
        }
      }
      
      // Ürünleri getir
      const products = await db.product.findMany({
        where,
        include: productIncludes,
        orderBy,
        skip,
        take: limit,
      });

      // Her ürün için toplam stok değerini hesapla
      const productsWithTotalStock = products.map(transformProductData);

      // Toplam sayfa sayısını hesapla
      const totalPages = Math.ceil(total / limit);

      return {
        data: productsWithTotalStock,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.error('Ürünler getirilirken hata oluştu:', error);
      // Hata durumunda boş sonuç döndür
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }
  },

  /**
   * Öne çıkan ürünleri getirir
   * @returns Öne çıkan ürünler listesi
   */
  async getFeaturedProducts(): Promise<ProductWithRelations[]> {
    try {
      const products = await db.product.findMany({
        where: {
          featured: true,
        },
        include: productIncludes,
        orderBy: {
          createdAt: 'desc',
        },
        take: 8,
      });

      return convertDecimalToNumber(products.map(transformProductData));
    } catch (error) {
      handleServiceError(error, 'Öne çıkan ürünler getirilirken hata oluştu');
      return [];
    }
  },

  /**
   * Belirli bir kategorideki ürünleri getirir
   * @param categorySlug - Kategori slug'ı
   * @returns Kategoriye ait ürünler listesi
   */
  async getProductsByCategory(categorySlug: string): Promise<ProductWithRelations[]> {
    try {
      const products = await db.product.findMany({
        where: {
          category: {
            slug: categorySlug,
          },
        },
        include: productIncludes,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return convertDecimalToNumber(products.map(transformProductData));
    } catch (error) {
      handleServiceError(error, `${categorySlug} kategorisindeki ürünler getirilirken hata oluştu`);
      return [];
    }
  },

  /**
   * Belirli bir ürünü ID'ye göre getirir
   * @param id - Ürün ID'si
   * @returns Ürün bilgileri veya null
   */
  async getProductById(id: string): Promise<ProductWithRelations | null> {
    try {
      const product = await db.product.findUnique({
        where: { id },
        include: productIncludes,
      });

      if (!product) return null;

      return convertDecimalToNumber(transformProductData(product));
    } catch (error) {
      handleServiceError(error, `${id} ID'li ürün getirilirken hata oluştu`);
      return null;
    }
  },

  /**
   * Belirli bir ürünü slug'a göre getirir
   * @param slug - Ürün slug'ı
   * @returns Ürün bilgileri veya null
   */
  async getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
    try {
      const product = await db.product.findUnique({
        where: { slug },
        include: productIncludes,
      });

      if (!product) return null;

      return convertDecimalToNumber(transformProductData(product));
    } catch (error) {
      handleServiceError(error, `${slug} slug'lı ürün getirilirken hata oluştu`);
      return null;
    }
  },

  /**
   * Arama sorgusuna göre ürünleri getirir
   * @param query - Arama sorgusu
   * @returns Arama sonuçları
   */
  async searchProducts(query: string): Promise<ProductWithRelations[]> {
    try {
      const products = await db.product.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: productIncludes,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return convertDecimalToNumber(products.map(transformProductData));
    } catch (error) {
      handleServiceError(error, `"${query}" sorgusu ile ürünler aranırken hata oluştu`);
      return [];
    }
  },
  
  /**
   * Listeleme için optimize edilmiş ürün verilerini getirir
   * @param limit - Getirilecek ürün sayısı
   * @returns Optimize edilmiş ürün listesi
   */
  async getProductsForListing(limit: number = 20): Promise<ProductListItem[]> {
    try {
      const products = await db.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          slug: true,
          stock: true,
          images: {
            where: { isMain: true },
            select: { url: true },
            take: 1,
          },
          category: {
            select: { name: true, slug: true },
          },
          variations: {
            select: { stock: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      
      return products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        slug: product.slug,
        mainImage: product.images[0]?.url || '',
        categoryName: product.category.name,
        categorySlug: product.category.slug,
        totalStock: product.variations.length > 0
          ? product.variations.reduce((total, v) => total + v.stock, 0)
          : product.stock,
      }));
    } catch (error) {
      handleServiceError(error, 'Ürün listesi getirilirken hata oluştu');
      return [];
    }
  }
}; 