import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

/**
 * Sipariş listeleme sorgu parametreleri şeması
 */
export const orderQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  userId: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

/**
 * Sipariş durumu güncelleme şeması
 */
export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  trackingNumber: z.string().optional(),
  estimatedDeliveryDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  notes: z.string().optional(),
});

/**
 * Şemalardan türetilen tipler
 */
export type OrderQueryParams = z.infer<typeof orderQuerySchema>;
export type UpdateOrderStatusData = z.infer<typeof updateOrderStatusSchema>; 