import { db } from '@/lib/db';
import { Category } from '@prisma/client';

export interface CategoryWithRelations extends Category {
  children?: Category[];
  parent?: Category | null;
  products?: any[];
}

export const categoryService = {
  /**
   * Tüm kategorileri getirir
   */
  async getAllCategories(): Promise<CategoryWithRelations[]> {
    return db.category.findMany({
      include: {
        children: true,
        parent: true,
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  },

  /**
   * Belirli bir kategoriyi ID'ye göre getirir
   */
  async getCategoryById(id: string): Promise<CategoryWithRelations | null> {
    return db.category.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
      },
    });
  },

  /**
   * Belirli bir kategoriyi slug'a göre getirir
   */
  async getCategoryBySlug(slug: string): Promise<CategoryWithRelations | null> {
    return db.category.findUnique({
      where: { slug },
      include: {
        children: true,
        parent: true,
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
      },
    });
  },

  /**
   * Ana kategorileri getirir (üst kategorisi olmayanlar)
   */
  async getMainCategories(): Promise<CategoryWithRelations[]> {
    return db.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        children: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: {
                  where: { isMain: true },
                  take: 1,
                },
              },
            },
          },
        },
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  },

  /**
   * Belirli bir kategorinin alt kategorilerini getirir
   */
  async getSubcategories(parentId: string): Promise<CategoryWithRelations[]> {
    return db.category.findMany({
      where: {
        parentId,
      },
      include: {
        children: true,
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  },

  // Yeni eklenen metodlar
  async createCategory(data: {
    name: string;
    slug?: string;
    description?: string;
    image?: string;
    parentId?: string;
  }): Promise<Category> {
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');
    
    return db.category.create({
      data: {
        ...data,
        slug,
      },
    });
  },

  async updateCategory(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      image?: string;
      parentId?: string;
    }
  ): Promise<Category> {
    let updateData = { ...data };
    if (data.name && !data.slug) {
      updateData.slug = data.name.toLowerCase().replace(/\s+/g, '-');
    }

    return db.category.update({
      where: { id },
      data: updateData,
    });
  },

  async deleteCategory(id: string): Promise<Category> {
    return db.category.delete({
      where: { id },
    });
  },

  async getCategoryTree(): Promise<CategoryWithRelations[]> {
    return db.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  },
};
