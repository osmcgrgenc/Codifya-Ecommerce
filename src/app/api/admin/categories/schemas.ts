import { z } from 'zod';

/**
 * Kategori listeleme sorgu parametreleri şeması
 */
export const categoryQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional(),
  sortBy: z.string().optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  parentId: z.string().optional(),
});

/**
 * Kategori oluşturma şeması
 */
export const createCategorySchema = z.object({
  name: z.string().min(2, { message: "Kategori adı en az 2 karakter olmalıdır" }),
  description: z.string().optional(),
  image: z.string().url({ message: "Geçerli bir URL girilmelidir" }).optional(),
  parentId: z.string().optional(),
  slug: z.string().optional(),
});

/**
 * Kategori güncelleme şeması
 */
export const updateCategorySchema = createCategorySchema.partial();

/**
 * Şemalardan türetilen tipler
 */
export type CategoryQueryParams = z.infer<typeof categoryQuerySchema>;
export type CreateCategoryData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>; 