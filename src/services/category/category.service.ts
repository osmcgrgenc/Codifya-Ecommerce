import { db } from '@/lib/db';
import { Category } from '@prisma/client';

export const categoryService = {
  /**
   * Tüm kategorileri getirir
   * @returns Kategori listesi
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      return await db.category.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          order: 'asc',
        },
      });
    } catch (error) {
      // console.error('Kategoriler getirilirken hata oluştu:', error);
      return [];
    }
  },

  /**
   * Ana kategorileri getirir (parentId null olanlar)
   * @returns Ana kategori listesi
   */
  async getMainCategories(): Promise<Category[]> {
    try {
      if (!db || !db.category) {
        // console.error('Veritabanı bağlantısı bulunamadı');
        return [];
      }
      return await db.category.findMany({
        where: {
          isActive: true,
          parentId: null,
        },
        orderBy: {
          order: 'asc',
        },
      });
    } catch (error) {
      // console.error('Ana kategoriler getirilirken hata oluştu:', error);
      return [];
    }
  },

  /**
   * Alt kategorileri getirir
   * @param parentId - Üst kategori ID'si
   * @returns Alt kategori listesi
   */
  async getSubCategories(parentId: string): Promise<Category[]> {
    try {
      return await db.category.findMany({
        where: {
          isActive: true,
          parentId,
        },
        orderBy: {
          order: 'asc',
        },
      });
    } catch (error) {
      // console.error('Alt kategoriler getirilirken hata oluştu:', error);
      return [];
    }
  },
}; 