import { db } from '@/lib/db';
import { Category } from '@prisma/client';

export const categoryService = {
  /**
   * Tüm kategorileri getirir
   */
  async getAllCategories(): Promise<Category[]> {
    return db.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  },

  /**
   * Belirli bir kategoriyi ID'ye göre getirir
   */
  async getCategoryById(id: string): Promise<Category | null> {
    return db.category.findUnique({
      where: { id },
    });
  },

  /**
   * Belirli bir kategoriyi slug'a göre getirir
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return db.category.findUnique({
      where: { slug },
    });
  },

  /**
   * Ana kategorileri getirir (üst kategorisi olmayanlar)
   */
  async getMainCategories(): Promise<Category[]> {
    return db.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        children: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  },

  /**
   * Belirli bir kategorinin alt kategorilerini getirir
   */
  async getSubcategories(parentId: string): Promise<Category[]> {
    return db.category.findMany({
      where: {
        parentId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  },
}; 