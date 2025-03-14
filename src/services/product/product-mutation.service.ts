import { db } from '@/lib/db';
import { Product } from '@prisma/client';
import { ProductWithRelations, CreateProductData, UpdateProductData } from './types';
import {
  ensureServer,
  handleServiceError,
  generateProductSlug,
  productIncludes,
  calculateTotalStock,
} from './utils';

/**
 * Ürün mutasyon servisi
 * Ürün ekleme, güncelleme ve silme işlemlerini yönetir
 */
export const productMutationService = {
  /**
   * Yeni ürün oluşturur
   * @param data - Ürün verileri
   * @returns Oluşturulan ürün
   */
  async createProduct(data: CreateProductData): Promise<ProductWithRelations> {
    ensureServer();

    try {
      // Slug oluştur
      const slug = generateProductSlug(data.name, data.slug);

      // Ürünü oluştur
      const product = await db.product.create({
        data: {
          name: data.name,
          description: data.description || '',
          price: data.price,
          categoryId: data.categoryId,
          brandId: data.brandId,
          stock: data.stock || 0,
          featured: data.featured || false,
          slug,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
        },
      });

      // Ürün görsellerini ekle (paralel olarak)
      if (data.images && data.images.length > 0) {
        await Promise.all(
          data.images.map(image =>
            db.productImage.create({
              data: {
                url: image.url,
                isMain: image.isMain || false,
                productId: product.id,
              },
            })
          )
        );
      }

      // Oluşturulan ürünü ilişkileriyle birlikte getir
      const productWithRelations = await db.product.findUnique({
        where: { id: product.id },
        include: productIncludes,
      });

      if (!productWithRelations) {
        throw new Error('Ürün oluşturuldu ancak getirilemedi');
      }

      return {
        ...productWithRelations,
        totalStock: calculateTotalStock(productWithRelations),
      } as ProductWithRelations;
    } catch (error) {
      return handleServiceError(error, 'Ürün oluşturulurken hata oluştu');
    }
  },

  /**
   * Ürün günceller
   * @param id - Ürün ID'si
   * @param data - Güncellenecek veriler
   * @returns Güncellenen ürün
   */
  async updateProduct(id: string, data: UpdateProductData): Promise<ProductWithRelations> {
    ensureServer();

    try {
      // Slug oluştur
      let slug = data.slug;
      if (data.name && !slug) {
        slug = generateProductSlug(data.name);
      }

      // Ürünü güncelle
      await db.product.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.price !== undefined && { price: data.price }),
          ...(data.categoryId && { categoryId: data.categoryId }),
          ...(data.brandId && { brandId: data.brandId }),
          ...(data.stock !== undefined && { stock: data.stock }),
          ...(data.featured !== undefined && { featured: data.featured }),
          ...(slug && { slug }),
          ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
          ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription }),
        },
      });

      // Güncellenen ürünü ilişkileriyle birlikte getir
      const productWithRelations = await db.product.findUnique({
        where: { id },
        include: productIncludes,
      });

      if (!productWithRelations) {
        throw new Error('Ürün güncellendi ancak getirilemedi');
      }

      return {
        ...productWithRelations,
        totalStock: calculateTotalStock(productWithRelations),
      } as ProductWithRelations;
    } catch (error) {
      return handleServiceError(error, 'Ürün güncellenirken hata oluştu');
    }
  },

  /**
   * Ürün siler
   * @param id - Ürün ID'si
   * @returns Silinen ürün
   */
  async deleteProduct(id: string): Promise<Product> {
    ensureServer();

    try {
      // İlişkili verileri sil (paralel olarak)
      await Promise.all([
        // Ürünle ilişkili tüm görselleri sil
        db.productImage.deleteMany({
          where: { productId: id },
        }),

        // Ürünle ilişkili tüm satıcıları sil
        db.productSeller.deleteMany({
          where: { productId: id },
        }),

        // Ürünle ilişkili tüm varyasyonları sil
        db.variation.deleteMany({
          where: { productId: id },
        }),
      ]);

      // Ürünü sil
      return await db.product.delete({
        where: { id },
      });
    } catch (error) {
      return handleServiceError(error, 'Ürün silinirken hata oluştu');
    }
  },
};
