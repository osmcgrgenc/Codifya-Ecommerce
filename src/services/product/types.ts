import { Product, ProductImage, ProductSeller, Variation, Brand, Category } from '@prisma/client';

/**
 * Ürün filtreleme seçenekleri
 */
export interface ProductFilter {
  name?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}

/**
 * İlişkili verileri içeren ürün tipi
 */
export interface ProductWithRelations extends Product {
  category: Category; // 'any' yerine spesifik tip kullanımı
  brand: Brand;
  images: ProductImage[];
  seller: ProductSeller[];
  variations: Variation[];
  totalStock?: number;
}

/**
 * Sayfalanmış sonuç tipi
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Ürün oluşturma için gerekli veri tipi
 */
export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  brandId: string;
  stock?: number;
  featured?: boolean;
  slug?: string;
  images: { url: string; isMain?: boolean }[];
  metaTitle?: string;
  metaDescription?: string;
}

/**
 * Ürün güncelleme için gerekli veri tipi
 */
export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  brandId?: string;
  stock?: number;
  featured?: boolean;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
}

/**
 * Ürün görseli ekleme/güncelleme için gerekli veri tipi
 */
export interface ProductImageData {
  url: string;
  isMain?: boolean;
}

/**
 * Ürün satıcısı ekleme için gerekli veri tipi
 */
export interface ProductSellerData {
  productId: string;
  sellerId: string;
  price: number;
  stock: number;
}

/**
 * Ürün satıcısı güncelleme için gerekli veri tipi
 */
export interface UpdateProductSellerData {
  price?: number;
  stock?: number;
}

/**
 * Ürün listeleme için optimize edilmiş veri tipi
 */
export interface ProductListItem {
  id: string;
  name: string;
  price: number;
  slug: string;
  mainImage?: string;
  categoryName?: string;
  categorySlug?: string;
  totalStock?: number;
}
