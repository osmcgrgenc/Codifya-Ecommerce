import { db } from '@/lib/db';
import { Product, ProductImage, ProductSeller, Variation, Brand } from '@prisma/client';

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
    return db.product.findMany({
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

    // Toplam sayfa sayısını hesapla
    const totalPages = Math.ceil(total / limit);

    return {
      data: products,
      total,
      page,
      limit,
      totalPages,
    };
  },

  /**
   * Öne çıkan ürünleri getirir
   */
  async getFeaturedProducts(): Promise<ProductWithRelations[]> {
    return db.product.findMany({
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
      take: 6,
    });
  },

  /**
   * Belirli bir kategorideki ürünleri getirir
   */
  async getProductsByCategory(categorySlug: string): Promise<ProductWithRelations[]> {
    return db.product.findMany({
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
    });
  },

  /**
   * Belirli bir ürünü ID'ye göre getirir
   */
  async getProductById(id: string): Promise<ProductWithRelations | null> {
    return db.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: true,
        seller: true,
        variations: true,
      },
    });
  },

  /**
   * Belirli bir ürünü slug'a göre getirir
   */
  async getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
    return db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: true,
        seller: true,
        variations: true,
      },
    });
  },

  /**
   * Arama sorgusuna göre ürünleri getirir
   */
  async searchProducts(query: string): Promise<ProductWithRelations[]> {
    return db.product.findMany({
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
    });
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
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');
    
    return db.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock || 0,
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
      updateData.slug = data.name.toLowerCase().replace(/\s+/g, '-');
    }

    return db.product.update({
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
  },

  /**
   * Ürün siler
   */
  async deleteProduct(id: string): Promise<Product> {
    return db.product.delete({
      where: { id },
    });
  },

  // Yeni eklenen metodlar
  async addProductImage(
    productId: string,
    data: { url: string; isMain?: boolean }
  ): Promise<ProductImage> {
    return db.productImage.create({
      data: {
        ...data,
        productId,
      },
    });
  },

  async updateProductImage(
    id: string,
    data: { url?: string; isMain?: boolean }
  ): Promise<ProductImage> {
    return db.productImage.update({
      where: { id },
      data,
    });
  },

  async deleteProductImage(id: string): Promise<ProductImage> {
    return db.productImage.delete({
      where: { id },
    });
  },

  async addProductSeller(
    data: {
      productId: string;
      sellerId: string;
      price: number;
      stock: number;
    }
  ): Promise<ProductSeller> {
    return db.productSeller.create({
      data,
    });
  },

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

  async deleteProductSeller(
    productId: string,
    sellerId: string,
  ): Promise<ProductSeller> {
    return db.productSeller.delete({
      where: {
        productId_sellerId: {
          productId,
          sellerId,
        },
      },
    });
  },
};
