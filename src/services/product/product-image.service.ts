import { db } from '@/lib/db';
import { ProductImage } from '@prisma/client';
import { ProductImageData } from './types';
import { ensureServer, handleServiceError } from './utils';

/**
 * Ürün görselleri servisi
 * Ürün görsellerinin eklenmesi, güncellenmesi ve silinmesi işlemlerini yönetir
 */
export const productImageService = {
  /**
   * Ürün resmi ekler
   * @param productId - Ürün ID'si
   * @param data - Görsel verileri
   * @returns Eklenen görsel
   */
  async addProductImage(productId: string, data: ProductImageData): Promise<ProductImage> {
    ensureServer();

    try {
      // Eğer ana görsel olarak işaretlendiyse, diğer görselleri ana görsel olmaktan çıkar
      if (data.isMain) {
        await db.productImage.updateMany({
          where: { productId, isMain: true },
          data: { isMain: false },
        });
      }

      // Yeni görseli ekle
      return await db.productImage.create({
        data: {
          url: data.url,
          isMain: data.isMain || false,
          productId,
        },
      });
    } catch (error) {
      return handleServiceError(error, 'Ürün görseli eklenirken hata oluştu');
    }
  },

  /**
   * Ürün resmi günceller
   * @param id - Görsel ID'si
   * @param data - Güncellenecek veriler
   * @returns Güncellenen görsel
   */
  async updateProductImage(id: string, data: Partial<ProductImageData>): Promise<ProductImage> {
    ensureServer();

    try {
      // Görsel bilgilerini al
      const image = await db.productImage.findUnique({
        where: { id },
      });

      if (!image) {
        throw new Error('Görsel bulunamadı');
      }

      // Eğer ana görsel olarak işaretlendiyse, diğer görselleri ana görsel olmaktan çıkar
      if (data.isMain) {
        await db.productImage.updateMany({
          where: { productId: image.productId, isMain: true },
          data: { isMain: false },
        });
      }

      // Görseli güncelle
      return await db.productImage.update({
        where: { id },
        data: {
          ...(data.url && { url: data.url }),
          ...(data.isMain !== undefined && { isMain: data.isMain }),
        },
      });
    } catch (error) {
      return handleServiceError(error, 'Ürün görseli güncellenirken hata oluştu');
    }
  },

  /**
   * Ürün resmi siler
   * @param id - Görsel ID'si
   * @returns Silinen görsel
   */
  async deleteProductImage(id: string): Promise<ProductImage> {
    ensureServer();

    try {
      return await db.productImage.delete({
        where: { id },
      });
    } catch (error) {
      return handleServiceError(error, 'Ürün görseli silinirken hata oluştu');
    }
  },

  /**
   * Ürüne ait tüm görselleri getirir
   * @param productId - Ürün ID'si
   * @returns Görseller listesi
   */
  async getProductImages(productId: string): Promise<ProductImage[]> {
    try {
      return await db.productImage.findMany({
        where: { productId },
        orderBy: { isMain: 'desc' },
      });
    } catch (error) {
      return [];
    }
  },

  /**
   * Ürünün ana görselini getirir
   * @param productId - Ürün ID'si
   * @returns Ana görsel veya null
   */
  async getMainProductImage(productId: string): Promise<ProductImage | null> {
    try {
      const mainImage = await db.productImage.findFirst({
        where: {
          productId,
          isMain: true,
        },
      });

      if (mainImage) return mainImage;

      // Ana görsel yoksa ilk görseli getir
      return await db.productImage.findFirst({
        where: { productId },
      });
    } catch (error) {
      return null;
    }
  },

  /**
   * Toplu görsel ekleme
   * @param productId - Ürün ID'si
   * @param images - Görsel verileri dizisi
   * @returns Eklenen görseller
   */
  async addMultipleProductImages(
    productId: string,
    images: ProductImageData[]
  ): Promise<ProductImage[]> {
    ensureServer();

    try {
      // Ana görsel var mı kontrol et
      const hasMainImage = images.some(img => img.isMain);

      // Eğer yeni görsellerden biri ana görsel olarak işaretlendiyse, mevcut ana görselleri güncelle
      if (hasMainImage) {
        await db.productImage.updateMany({
          where: { productId, isMain: true },
          data: { isMain: false },
        });
      }

      // Görselleri paralel olarak ekle
      const createdImages = await Promise.all(
        images.map(image =>
          db.productImage.create({
            data: {
              url: image.url,
              isMain: image.isMain || false,
              productId,
            },
          })
        )
      );

      return createdImages;
    } catch (error) {
      handleServiceError(error, 'Ürün görselleri eklenirken hata oluştu');
      return [];
    }
  },
};
