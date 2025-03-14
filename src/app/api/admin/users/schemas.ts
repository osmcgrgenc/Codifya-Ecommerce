import { z } from 'zod';
import { UserRole } from '@prisma/client';

/**
 * Kullanıcı listeleme sorgu parametreleri şeması
 */
export const userQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  sortBy: z.enum(['name', 'email', 'role', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type UserQueryParams = z.infer<typeof userQuerySchema>;

/**
 * Kullanıcı oluşturma şeması
 */
export const createUserSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
    .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
    .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir'),
  role: z.nativeEnum(UserRole).optional().default(UserRole.CUSTOMER),
  phone: z.string().optional(),
  image: z.string().optional(),
});

export type CreateUserData = z.infer<typeof createUserSchema>;

/**
 * Kullanıcı güncelleme şeması
 */
export const updateUserSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır').optional(),
  email: z.string().email('Geçerli bir e-posta adresi giriniz').optional(),
  password: z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
    .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
    .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir')
    .optional(),
  role: z.nativeEnum(UserRole).optional(),
  phone: z.string().optional(),
  image: z.string().optional(),
});

export type UpdateUserData = z.infer<typeof updateUserSchema>;

/**
 * Kullanıcı rol güncelleme şeması
 */
export const updateUserRoleSchema = z.object({
  userId: z.string().uuid("Geçerli bir kullanıcı ID'si gereklidir"),
  role: z.nativeEnum(UserRole),
});

export type UpdateUserRoleData = z.infer<typeof updateUserRoleSchema>;
