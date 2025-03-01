import { db } from '@/lib/db';
import { Product } from '@prisma/client';

export interface ProductFilter {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
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
  async getAllProducts(): Promise<Product[]> {
    return db.product.findMany({
      include: {
        category: true,
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
  ): Promise<PaginatedResult<Product>> {
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
          name: {
            contains: filters.category,
            mode: 'insensitive',
          },
        };
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
  async getFeaturedProducts(): Promise<Product[]> {
    return db.product.findMany({
      where: {
        featured: true,
      },
      include: {
        category: true,
      },
      take: 6,
    });
  },

  /**
   * Belirli bir kategorideki ürünleri getirir
   */
  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    return db.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      include: {
        category: true,
      },
    });
  },

  /**
   * Belirli bir ürünü ID'ye göre getirir
   */
  async getProductById(id: string): Promise<Product | null> {
    return db.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  },

  /**
   * Belirli bir ürünü slug'a göre getirir
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    return db.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });
  },

  /**
   * Arama sorgusuna göre ürünleri getirir
   */
  async searchProducts(query: string): Promise<Product[]> {
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
      },
    });
  },

  /**
   * Yeni ürün oluşturur
   */
  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    image: string;
    categoryId: string;
    stock?: number;
    featured?: boolean;
    slug?: string;
  }): Promise<Product> {
    // Slug oluştur (eğer verilmemişse)
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');

    return db.product.create({
      data: {
        ...data,
        slug,
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
      image?: string;
      categoryId?: string;
      stock?: number;
      featured?: boolean;
      slug?: string;
    }
  ): Promise<Product> {
    // Slug güncelle (eğer isim değiştiyse ve slug verilmediyse)
    let updateData = { ...data };
    if (data.name && !data.slug) {
      updateData.slug = data.name.toLowerCase().replace(/\s+/g, '-');
    }

    return db.product.update({
      where: { id },
      data: updateData,
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
};
