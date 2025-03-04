import { z } from 'zod';

/**
 * Varyasyon oluşturma şeması
 */
export const variationSchema = z.object({
  productId: z.string().min(1, 'Ürün ID gereklidir'),
  sku: z.string().min(1, 'SKU gereklidir'),
  price: z.number().min(0, 'Fiyat 0 veya daha büyük olmalıdır'),
  stock: z.number().int().min(0, 'Stok 0 veya daha büyük olmalıdır'),
  isActive: z.boolean().optional().default(true),
  options: z.array(
    z.object({
      optionId: z.string().min(1, 'Seçenek ID gereklidir'),
      optionTypeId: z.string().min(1, 'Seçenek tipi ID gereklidir')
    })
  ).min(1, 'En az bir seçenek gereklidir'),
  images: z.array(z.string()).optional()
});

/**
 * Varyasyon güncelleme şeması
 */
export const updateVariationSchema = z.object({
  sku: z.string().min(1, 'SKU gereklidir').optional(),
  price: z.number().min(0, 'Fiyat 0 veya daha büyük olmalıdır').optional(),
  stock: z.number().int().min(0, 'Stok 0 veya daha büyük olmalıdır').optional(),
  isActive: z.boolean().optional(),
  options: z.array(
    z.object({
      optionId: z.string().min(1, 'Seçenek ID gereklidir'),
      optionTypeId: z.string().min(1, 'Seçenek tipi ID gereklidir')
    })
  ).min(1, 'En az bir seçenek gereklidir').optional(),
  images: z.array(z.string()).optional()
});

/**
 * Varyasyon sorgu şeması
 */
export const variationQuerySchema = z.object({
  sku: z.string().optional(),
  isActive: z.boolean().optional(),
  optionId: z.string().optional(),
  optionTypeId: z.string().optional()
});

export type VariationInput = z.infer<typeof variationSchema>;
export type UpdateVariationInput = z.infer<typeof updateVariationSchema>;
export type VariationQuery = z.infer<typeof variationQuerySchema>; 