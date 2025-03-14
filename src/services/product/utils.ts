import { Product, Variation } from '@prisma/client';
import { ProductFilter } from './types';
import { slugify } from '@/lib/utils';

// Decimal tipi için bir arayüz tanımla
interface DecimalType {
  toNumber: () => number;
}

/**
 * İstemci tarafında çalışıp çalışmadığını kontrol eder
 * @returns İstemci tarafında çalışıyorsa true, sunucu tarafında çalışıyorsa false döner
 */
export const isClient = (): boolean => typeof window !== 'undefined';

/**
 * Sunucu tarafında çalıştığından emin olur, değilse hata fırlatır
 * @throws İstemci tarafında çalışıyorsa hata fırlatır
 */
export const ensureServer = (): void => {
  if (isClient()) {
    throw new Error('Bu işlem sadece sunucu tarafında gerçekleştirilebilir');
  }
};

/**
 * Servis hatalarını yönetir
 * @param error - Hata nesnesi
 * @param message - Hata mesajı
 * @throws Orijinal hatayı yeniden fırlatır
 */
export const handleServiceError = (error: unknown, message: string): never => {
  // eslint-disable-next-line no-console
  console.error(`${message}:`, error);
  throw error;
};

/**
 * Ürünün toplam stok miktarını hesaplar
 * @param product - Ürün nesnesi
 * @returns Toplam stok miktarı
 */
export const calculateTotalStock = (product: Product & { variations?: Variation[] }): number => {
  if (!product) return 0;

  // Eğer varyasyonlar varsa, varyasyonların stok toplamını döndür
  if (product.variations && product.variations.length > 0) {
    return product.variations.reduce((total, variation) => total + variation.stock, 0);
  }

  // Varyasyon yoksa ürünün kendi stok değerini döndür
  return product.stock;
};

/**
 * Ürün verilerini dönüştürür ve toplam stok bilgisini ekler
 * @param product - Ürün nesnesi
 * @returns Toplam stok bilgisi eklenmiş ürün nesnesi
 */
export const transformProductData = <T extends Product>(
  product: T & {
    variations?: Variation[];
    category?: any;
    brand?: any;
    images?: any[];
    seller?: any[];
  }
): T & { totalStock: number } => {
  // Decimal değerleri number'a dönüştür
  if (product.price && typeof product.price === 'object' && 'toNumber' in product.price) {
    product.price = (product.price as unknown as DecimalType).toNumber() as any;
  }

  if (product.discount && typeof product.discount === 'object' && 'toNumber' in product.discount) {
    product.discount = (product.discount as unknown as DecimalType).toNumber() as any;
  }

  // Varyasyonlardaki Decimal değerleri dönüştür
  if (product.variations && product.variations.length > 0) {
    product.variations = product.variations.map(variation => {
      if (variation.price && typeof variation.price === 'object' && 'toNumber' in variation.price) {
        variation.price = (variation.price as unknown as DecimalType).toNumber() as any;
      }
      return variation;
    });
  }

  return {
    ...product,
    totalStock: calculateTotalStock(product),
  };
};

/**
 * Ürün filtreleme sorgusunu oluşturur
 * @param filters - Filtre parametreleri
 * @returns Prisma sorgu nesnesi
 */
export const buildProductQuery = (filters?: ProductFilter) => {
  const where: any = {};

  if (!filters) return where;

  // İsim filtresi
  if (filters.name) {
    where.name = {
      contains: filters.name,
      mode: 'insensitive',
    };
  }

  // Kategori filtresi
  if (filters.category) {
    where.categoryId = filters.category;
  }

  // Marka filtresi
  if (filters.brand) {
    where.brandId = filters.brand;
  }

  // Öne çıkan ürünler filtresi
  if (filters.featured !== undefined) {
    where.featured = filters.featured;
  }

  // Fiyat aralığı filtresi
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};

    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice;
    }

    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice;
    }
  }

  return where;
};

/**
 * Ürün için slug oluşturur
 * @param name - Ürün adı
 * @param existingSlug - Mevcut slug (varsa)
 * @returns Oluşturulan slug
 */
export const generateProductSlug = (name: string, existingSlug?: string): string => {
  return existingSlug || slugify(name);
};

/**
 * Tüm ürün sorgularında kullanılan include nesnesi
 */
export const productIncludes = {
  category: true,
  brand: true,
  images: true,
  seller: true,
  variations: true,
};
