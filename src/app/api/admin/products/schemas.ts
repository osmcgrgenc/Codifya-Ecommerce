import { z } from 'zod';

/**
 * Ürün listeleme sorgu parametreleri şeması
 */
export const productQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  sortBy: z
    .enum(['name', 'price', 'stock', 'createdAt', 'updatedAt'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  featured: z.enum(['true', 'false']).optional(),
});

export type ProductQueryParams = z.infer<typeof productQuerySchema>;

/**
 * Ürün oluşturma şeması
 */
export const createProductSchema = z.object({
  name: z.string().min(3, 'Ürün adı en az 3 karakter olmalıdır'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Fiyat pozitif bir değer olmalıdır'),
  stock: z.coerce.number().nonnegative('Stok negatif olamaz').optional(),
  categoryId: z.string().uuid("Geçerli bir kategori ID'si gereklidir"),
  brandId: z.string().uuid("Geçerli bir marka ID'si gereklidir"),
  featured: z.boolean().optional().default(false),
  slug: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type CreateProductData = z.infer<typeof createProductSchema>;

/**
 * Ürün güncelleme şeması
 */
export const updateProductSchema = createProductSchema.partial();

export type UpdateProductData = z.infer<typeof updateProductSchema>;

/**
 * Ürün resmi ekleme şeması
 */
export const productImageSchema = z.object({
  url: z.string().url('Geçerli bir URL olmalıdır'),
  isMain: z.boolean().optional().default(false),
});

export type ProductImageData = z.infer<typeof productImageSchema>;
