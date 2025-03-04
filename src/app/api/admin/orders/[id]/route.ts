import { NextRequest } from 'next/server';
import { orderService } from '@/services/order-service';
import { withMiddleware } from '@/lib/api-middleware';
import { 
  createSuccessResponse, 
  createValidationErrorResponse,
  createNotFoundResponse,
  handleValidationResult
} from '@/lib/api-response';
import { parseJsonData } from '@/services/api-service';
import { updateOrderStatusSchema, UpdateOrderStatusData } from '../schemas';
import { OrderStatus } from '@prisma/client';

/**
 * GET: Belirli bir siparişin detaylarını getir
 */
async function getOrderById(req: NextRequest, { params }: { params: { id: string } }, session: any) {
  const { id } = params;

  // Siparişi getir
  const order = await orderService.getOrderById(id);

  if (!order) {
    return createNotFoundResponse('Sipariş');
  }

  return createSuccessResponse(order, 'Sipariş başarıyla getirildi');
}

/**
 * PATCH: Sipariş güncelle
 */
async function updateOrder(req: NextRequest, { params }: { params: { id: string } }, session: any) {
  const { id } = params;

  // İstek gövdesini doğrula
  const bodyResult = await parseJsonData(req, updateOrderStatusSchema);
  const validationResult = handleValidationResult(bodyResult);
  
  if (!validationResult.success) {
    return validationResult.response;
  }

  const data = validationResult.data as UpdateOrderStatusData;
  
  try {
    // Siparişin var olup olmadığını kontrol et
    const existingOrder = await orderService.getOrderById(id);
    if (!existingOrder) {
      return createNotFoundResponse('Sipariş');
    }
    
    // Sipariş durumunu güncelle
    const updatedOrder = await orderService.updateOrderStatus(
      id, 
      data.status as OrderStatus, 
      {
        trackingNumber: data.trackingNumber,
        estimatedDeliveryDate: data.estimatedDeliveryDate,
      }
    );
    
    return createSuccessResponse(updatedOrder, 'Sipariş durumu başarıyla güncellendi');
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * Sipariş detay API endpoint'leri
 */
export const GET = withMiddleware(getOrderById, { requiredRole: 'ADMIN' });
export const PATCH = withMiddleware(updateOrder, { requiredRole: 'ADMIN' }); 