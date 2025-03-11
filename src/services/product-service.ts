import { db } from '@/lib/db';
import { Product, ProductImage, ProductSeller, Variation, Brand } from '@prisma/client';
import { variationService } from './variation-service';
import { slugify, convertDecimalToNumber } from '@/lib/utils';

export interface ProductFilter {
  name?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}

export interface ProductWithRelations extends Product {
  category: any;
  brand: Brand;
  images: ProductImage[];
  seller: ProductSeller[];
  variations: Variation[];
  totalStock?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const productService = {
  /**
   * Tüm ürünleri getirir
   */
  async getAllProducts(): Promise<ProductWithRelations[]> {
    const products = await db.product.findMany({
      include: {
        category: true,
        brand: true,
        images: true,
        seller: true,
        variations: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Her ürün için toplam stok değerini hesapla
    return convertDecimalToNumber(products.map(product => ({
      ...product,
      totalStock: this.calculateTotalStock(product),
    })));
  },

  /**
   * Sayfalanmış ve filtrelenmiş ürünleri getirir
   */
  async getPaginatedProducts(
    page: number = 1,
    limit: number = 10,
    filters?: ProductFilter,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResult<ProductWithRelations>> {
    const skip = (page - 1) * limit;

    // Filtreleri oluştur
    const where: any = {};

    if (filters) {
      if (filters.name) {
        where.name = {
          contains: filters.name,
          mode: 'insensitive',
        };
      }

      if (filters.category) {
        where.category = {
          slug: filters.category,
        };
      }

      if (filters.brand) {
        where.brand = {
          slug: filters.brand,
        };
      }

      if (filters.featured !== undefined) {
        where.featured = filters.featured;
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.price = {};

        if (filters.minPrice !== undefined) {
          where.price.gte = filters.minPrice;
        }

        if (filters.maxPrice !== undefined) {
          where.price.lte = filters.maxPrice;
        }
      }
    }

    // Sıralama seçeneklerini oluştur
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Toplam ürün sayısını al
    const total = await db.product.count({ where });

    // Ürünleri getir
    const products = await db.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        images: true,
        seller: true,
        variations: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    // Her ürün için toplam stok değerini hesapla
    const productsWithStock = products.map(product => ({
      ...product,
      totalStock: this.calculateTotalStock(product),
    }));

    // Toplam sayfa sayısını hesapla
    const totalPages = Math.ceil(total / limit);

    return convertDecimalToNumber({
      data: productsWithStock,
      total,
      page,
      limit,
      totalPages,
    });
  },

  /**
   * Öne çıkan ürünleri getirir
   */
  async getFeaturedProducts(): Promise<ProductWithRelations[]> {
    const products = await db.product.findMany({
      where: {
        featured: true,
      },
      include: {
        category: true,
        brand: true,
        images: true,
        seller: true,
        variations: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 8,
    });

    return convertDecimalToNumber(products.map(product => ({
      ...product,
      totalStock: this.calculateTotalStock(product),
    })));
  },

  /**
   * Belirli bir kategorideki ürünleri getirir
   */
  async getProductsByCategory(categorySlug: string): Promise<ProductWithRelations[]> {
    const products = await db.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      include: {
        category: true,
        brand: true,
        images: true,
        seller: true,
        variations: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return convertDecimalToNumber(products.map(product => ({
      ...product,
      totalStock: this.calculateTotalStock(product),
    })));
  },

  /**
   * Belirli bir ürünü ID'ye göre getirir
   */
  async getProductById(id: string): Promise<ProductWithRelations | null> {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: true,
        seller: true,
        variations: true,
      },
    });

    if (!product) return null;

    return convertDecimalToNumber({
      ...product,
      totalStock: this.calculateTotalStock(product),
    });
  },

  /**
   * Belirli bir ürünü slug'a göre getirir
   */
  async getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: true,
        seller: true,
        variations: true,
      },
    });

    if (!product) return null;

    return convertDecimalToNumber({
      ...product,
      totalStock: this.calculateTotalStock(product),
    });
  },

  /**
   * Arama sorgusuna göre ürünleri getirir
   */
  async searchProducts(query: string): Promise<ProductWithRelations[]> {
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
      include: {
        category: true,
        brand: true,
        images: true,
        seller: true,
        variations: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return convertDecimalToNumber(products.map(product => ({
      ...product,
      totalStock: this.calculateTotalStock(product),
    })));
  },

  /**
   * Yeni ürün oluşturur
   */
  async createProduct(data: {
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
  }): Promise<ProductWithRelations> {
    const slug = data.slug || slugify(data.name);

    // Ürünü oluştur
    const product = await db.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: 0, // Stok değeri varyasyonlardan hesaplanacak
        featured: data.featured || false,
        slug,
        categoryId: data.categoryId,
        brandId: data.brandId,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        images: {
          create: data.images,
        },
      },
      include: {
        category: true,
        brand: true,
        images: true,
        seller: true,
        variations: true,
      },
    });

    // Varsayılan varyasyon oluştur
    await variationService.createDefaultVariation(product.id, data.price);

    // Güncellenmiş ürünü getir
    return this.getProductById(product.id) as Promise<ProductWithRelations>;
  },

  /**
   * Ürün günceller
   */
  async updateProduct(
    id: string,
    data: {
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
  ): Promise<ProductWithRelations> {
    let updateData = { ...data };
    if (data.name && !data.slug) {
      updateData.slug = slugify(data.name);
    }

    // Stok değerini güncelleme verilerinden çıkar
    delete updateData.stock;

    // Ürünü güncelle
    const product = await db.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        brand: true,
        images: true,
        seller: true,
        variations: true,
      },
    });

    // Eğer fiyat güncellendiyse ve varsayılan varyasyon varsa, onu da güncelle
    if (data.price !== undefined) {
      const defaultVariation = product.variations.find(v => v.name === 'Varsayılan');
      if (defaultVariation) {
        await variationService.updateVariation(defaultVariation.id, {
          price: data.price,
        });
      }
    }

    // Eğer stok değeri belirtildiyse, varsayılan varyasyonun stok değerini güncelle
    if (data.stock !== undefined) {
      const defaultVariation = product.variations.find(v => v.name === 'Varsayılan');
      if (defaultVariation) {
        await variationService.updateVariation(defaultVariation.id, {
          stock: data.stock,
        });
      }
    }

    // Güncellenmiş ürünü getir
    return this.getProductById(id) as Promise<ProductWithRelations>;
  },

  /**
   * Ürün siler
   */
  async deleteProduct(id: string): Promise<Product> {
    // Önce ürüne ait varyasyonları sil
    const variations = await db.variation.findMany({
      where: { productId: id },
    });

    for (const variation of variations) {
      await variationService.deleteVariation(variation.id);
    }

    // Sonra ürünü sil
    return db.product.delete({
      where: { id },
    });
  },

  /**
   * Ürün resmi ekler
   */
  async addProductImage(
    productId: string,
    data: { url: string; isMain?: boolean }
  ): Promise<ProductImage> {
    // Eğer ana resim olarak işaretlendiyse, diğer resimleri ana resim olmaktan çıkar
    if (data.isMain) {
      await db.productImage.updateMany({
        where: { productId, isMain: true },
        data: { isMain: false },
      });
    }

    return db.productImage.create({
      data: {
        ...data,
        productId,
      },
    });
  },

  /**
   * Ürün resmi günceller
   */
  async updateProductImage(
    id: string,
    data: { url?: string; isMain?: boolean }
  ): Promise<ProductImage> {
    const image = await db.productImage.findUnique({
      where: { id },
      select: { productId: true },
    });

    // Eğer ana resim olarak işaretlendiyse, diğer resimleri ana resim olmaktan çıkar
    if (data.isMain && image) {
      await db.productImage.updateMany({
        where: { productId: image.productId, isMain: true },
        data: { isMain: false },
      });
    }

    return db.productImage.update({
      where: { id },
      data,
    });
  },

  /**
   * Ürün resmi siler
   */
  async deleteProductImage(id: string): Promise<ProductImage> {
    return db.productImage.delete({
      where: { id },
    });
  },

  /**
   * Ürün satıcısı ekler
   */
  async addProductSeller(data: {
    productId: string;
    sellerId: string;
    price: number;
    stock: number;
  }): Promise<ProductSeller> {
    return db.productSeller.create({
      data,
    });
  },

  /**
   * Ürün satıcısı günceller
   */
  async updateProductSeller(
    productId: string,
    sellerId: string,
    data: {
      price?: number;
      stock?: number;
    }
  ): Promise<ProductSeller> {
    return db.productSeller.update({
      where: {
        productId_sellerId: {
          productId,
          sellerId,
        },
      },
      data,
    });
  },

  /**
   * Ürün satıcısı siler
   */
  async deleteProductSeller(productId: string, sellerId: string): Promise<ProductSeller> {
    return db.productSeller.delete({
      where: {
        productId_sellerId: {
          productId,
          sellerId,
        },
      },
    });
  },

  /**
   * Ürünün toplam stok değerini hesaplar
   */
  calculateTotalStock(product: Product & { variations?: Variation[] }): number {
    if (!product.variations || product.variations.length === 0) {
      return 0;
    }

    // Tüm varyasyonların stok değerlerini topla
    return product.variations.reduce((total, variation) => total + variation.stock, 0);
  },
};
