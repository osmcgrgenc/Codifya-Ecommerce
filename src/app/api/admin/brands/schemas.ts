import { z } from 'zod';

/**
 * Marka listeleme sorgu parametreleri şeması
 */
export const brandQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional(),
  sortBy: z.string().optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

/**
 * Marka oluşturma şeması
 */
export const createBrandSchema = z.object({
  name: z.string().min(2, { message: "Marka adı en az 2 karakter olmalıdır" }),
  description: z.string().optional(),
  logo: z.string().url({ message: "Geçerli bir URL girilmelidir" }).optional(),
  country: z.string().optional(),
  slug: z.string().optional(),
});

/**
 * Marka güncelleme şeması
 */
export const updateBrandSchema = createBrandSchema.partial();

/**
 * Şemalardan türetilen tipler
 */
export type BrandQueryParams = z.infer<typeof brandQuerySchema>;
export type CreateBrandData = z.infer<typeof createBrandSchema>;
export type UpdateBrandData = z.infer<typeof updateBrandSchema>; 