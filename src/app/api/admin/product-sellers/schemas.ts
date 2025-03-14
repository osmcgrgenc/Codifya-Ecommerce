import { z } from 'zod';

/**
 * Ürün-satıcı ilişkisi oluşturma şeması
 */
export const productSellerSchema = z.object({
  productId: z.string().min(1, 'Ürün ID gereklidir'),
  sellerId: z.string().min(1, 'Satıcı ID gereklidir'),
  price: z.number().min(0, 'Fiyat 0 veya daha büyük olmalıdır'),
  stock: z.number().int().min(0, 'Stok 0 veya daha büyük olmalıdır'),
  isActive: z.boolean().optional().default(true),
});

/**
 * Ürün-satıcı ilişkisi güncelleme şeması
 */
export const updateProductSellerSchema = z.object({
  price: z.number().min(0, 'Fiyat 0 veya daha büyük olmalıdır').optional(),
  stock: z.number().int().min(0, 'Stok 0 veya daha büyük olmalıdır').optional(),
  isActive: z.boolean().optional(),
});

/**
 * Ürün-satıcı ilişkisi sorgu şeması
 */
export const productSellerQuerySchema = z.object({
  productId: z.string().optional(),
  sellerId: z.string().optional(),
});

export type ProductSellerInput = z.infer<typeof productSellerSchema>;
export type UpdateProductSellerInput = z.infer<typeof updateProductSellerSchema>;
export type ProductSellerQuery = z.infer<typeof productSellerQuerySchema>;
