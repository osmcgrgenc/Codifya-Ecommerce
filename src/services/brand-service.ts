import { db } from '@/lib/db';
import { Brand, Prisma } from '@prisma/client';
import { slugify } from '@/lib/utils';

export interface BrandFilter {
  search?: string;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const brandService = {
  /**
   * Tüm markaları getirir
   */
  async getAllBrands(): Promise<Brand[]> {
    return db.brand.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  },

  /**
   * Sayfalanmış ve filtrelenmiş markaları getirir
   */
  async getPaginatedBrands(
    page: number = 1,
    limit: number = 10,
    filters?: BrandFilter,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<PaginatedResult<Brand>> {
    const skip = (page - 1) * limit;

    // Filtreleri oluştur
    const where: Prisma.BrandWhereInput = {};

    if (filters) {
      if (filters.search) {
        where.OR = [
          {
            name: {
              contains: filters.search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: filters.search,
              mode: 'insensitive',
            },
          },
        ];
      }
    }

    // Sıralama seçeneklerini oluştur
    const orderBy: Prisma.BrandOrderByWithRelationInput = {};
    orderBy[sortBy as keyof Prisma.BrandOrderByWithRelationInput] = sortOrder;

    // Toplam marka sayısını al
    const total = await db.brand.count({ where });

    // Markaları getir
    const brands = await db.brand.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    // Toplam sayfa sayısını hesapla
    const totalPages = Math.ceil(total / limit);

    return {
      data: brands,
      total,
      page,
      limit,
      totalPages,
    };
  },

  /**
   * Belirli bir markayı ID'ye göre getirir
   */
  async getBrandById(id: string): Promise<Brand | null> {
    return db.brand.findUnique({
      where: { id },
    });
  },

  /**
   * Belirli bir markayı slug'a göre getirir
   */
  async getBrandBySlug(slug: string): Promise<Brand | null> {
    return db.brand.findUnique({
      where: { slug },
    });
  },

  /**
   * Yeni marka oluşturur
   */
  async createBrand(data: {
    name: string;
    description?: string;
    logo?: string;
    country?: string;
    slug?: string;
  }): Promise<Brand> {
    // Marka adının benzersiz olduğunu kontrol et
    const existingBrand = await db.brand.findFirst({
      where: { name: data.name },
    });

    if (existingBrand) {
      throw new Error('Bu marka adı zaten kullanılıyor');
    }

    // Slug oluştur
    const slug = data.slug || slugify(data.name);

    // Slug'ın benzersiz olduğunu kontrol et
    const existingSlug = await db.brand.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      throw new Error('Bu slug zaten kullanılıyor');
    }

    // Markayı oluştur
    return db.brand.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        logo: data.logo,
        country: data.country,
      },
    });
  },

  /**
   * Marka günceller
   */
  async updateBrand(
    id: string,
    data: {
      name?: string;
      description?: string;
      logo?: string;
      country?: string;
      slug?: string;
    }
  ): Promise<Brand> {
    // Markanın var olduğunu kontrol et
    const brand = await db.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new Error('Marka bulunamadı');
    }

    // Marka adı değiştiriliyorsa, benzersiz olduğunu kontrol et
    if (data.name && data.name !== brand.name) {
      const existingBrand = await db.brand.findFirst({
        where: { name: data.name },
      });

      if (existingBrand) {
        throw new Error('Bu marka adı zaten kullanılıyor');
      }
    }

    // Slug oluştur veya mevcut slug'ı kullan
    let slug = brand.slug;
    if (data.slug) {
      slug = data.slug;
    } else if (data.name) {
      slug = slugify(data.name);
    }

    // Slug değiştiriliyorsa, benzersiz olduğunu kontrol et
    if (slug !== brand.slug) {
      const existingSlug = await db.brand.findUnique({
        where: { slug },
      });

      if (existingSlug) {
        throw new Error('Bu slug zaten kullanılıyor');
      }
    }

    // Markayı güncelle
    return db.brand.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description,
        logo: data.logo,
        country: data.country,
      },
    });
  },

  /**
   * Marka siler
   */
  async deleteBrand(id: string): Promise<Brand> {
    // Markanın var olduğunu kontrol et
    const brand = await db.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new Error('Marka bulunamadı');
    }

    // Markanın ürünleri var mı kontrol et
    const productsCount = await db.product.count({
      where: { brandId: id },
    });

    if (productsCount > 0) {
      throw new Error('Bu markaya ait ürünler bulunduğu için silinemez');
    }

    // Markayı sil
    return db.brand.delete({
      where: { id },
    });
  },
};
