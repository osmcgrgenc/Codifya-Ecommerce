import { z } from 'zod';
import { UserRole } from '@prisma/client';

/**
 * Satıcı listeleme sorgu parametreleri şeması
 */
export const sellerQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Satıcı güncelleme şeması
 */
export const updateSellerSchema = z.object({
  name: z.string().min(2, { message: 'İsim en az 2 karakter olmalıdır' }).optional(),
  email: z.string().email({ message: 'Geçerli bir e-posta adresi girilmelidir' }).optional(),
  phone: z.string().optional(),
  image: z.string().url({ message: 'Geçerli bir URL girilmelidir' }).optional(),
  role: z.nativeEnum(UserRole).optional(),
});

/**
 * Ürün-Satıcı ilişkisi şeması
 */
export const productSellerSchema = z.object({
  productId: z.string(),
  sellerId: z.string(),
  price: z.number().positive({ message: 'Fiyat pozitif bir değer olmalıdır' }),
  stock: z.number().int().nonnegative({ message: 'Stok negatif olamaz' }),
});

/**
 * Ürün-Satıcı güncelleme şeması
 */
export const updateProductSellerSchema = z.object({
  price: z.number().positive({ message: 'Fiyat pozitif bir değer olmalıdır' }).optional(),
  stock: z.number().int().nonnegative({ message: 'Stok negatif olamaz' }).optional(),
});

/**
 * Şemalardan türetilen tipler
 */
export type SellerQueryParams = z.infer<typeof sellerQuerySchema>;
export type UpdateSellerData = z.infer<typeof updateSellerSchema>;
export type ProductSellerData = z.infer<typeof productSellerSchema>;
export type UpdateProductSellerData = z.infer<typeof updateProductSellerSchema>;
