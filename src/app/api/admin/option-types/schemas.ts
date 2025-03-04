import { z } from 'zod';

/**
 * Seçenek tipi oluşturma şeması
 */
export const optionTypeSchema = z.object({
  name: z.string().min(1, 'İsim gereklidir'),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

/**
 * Seçenek tipi güncelleme şeması
 */
export const updateOptionTypeSchema = z.object({
  name: z.string().min(1, 'İsim gereklidir').optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

/**
 * Seçenek tipi sorgu şeması
 */
export const optionTypeQuerySchema = z.object({
  name: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type OptionTypeInput = z.infer<typeof optionTypeSchema>;
export type UpdateOptionTypeInput = z.infer<typeof updateOptionTypeSchema>;
export type OptionTypeQuery = z.infer<typeof optionTypeQuerySchema>; 