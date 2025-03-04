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
import { OrderStatus } from '@prisma/client';

/**
 * POST: Toplu sipariş durumu güncelleme
 */
async function updateOrdersStatus(req: NextRequest, context: any, session: any) {
  try {
    // İstek gövdesini al
    const body = await req.json();
    
    // Gerekli alanları kontrol et
    if (!body.orderIds || !Array.isArray(body.orderIds) || body.orderIds.length === 0) {
      return createValidationErrorResponse(['Sipariş ID listesi gereklidir']);
    }
    
    if (!body.status || !Object.values(OrderStatus).includes(body.status)) {
      return createValidationErrorResponse(['Geçerli bir sipariş durumu belirtilmelidir']);
    }
    
    const { orderIds, status } = body;
    const additionalData = {
      trackingNumber: body.trackingNumber,
      estimatedDeliveryDate: body.estimatedDeliveryDate ? new Date(body.estimatedDeliveryDate) : undefined,
    };
    
    // Her sipariş için durumu güncelle
    const results = [];
    const errors = [];
    
    for (const orderId of orderIds) {
      try {
        // Siparişin var olup olmadığını kontrol et
        const existingOrder = await orderService.getOrderById(orderId);
        if (!existingOrder) {
          errors.push(`Sipariş bulunamadı: ${orderId}`);
          continue;
        }
        
        // Sipariş durumunu güncelle
        const updatedOrder = await orderService.updateOrderStatus(
          orderId, 
          status, 
          additionalData
        );
        
        results.push(updatedOrder);
      } catch (error: any) {
        errors.push(`${orderId}: ${error.message}`);
      }
    }
    
    return createSuccessResponse(
      { 
        updatedOrders: results, 
        errors: errors.length > 0 ? errors : undefined,
        totalUpdated: results.length,
        totalFailed: errors.length
      }, 
      'Sipariş durumları güncellendi'
    );
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * Sipariş durumu güncelleme API endpoint'i
 */
export const POST = withMiddleware(updateOrdersStatus, { requiredRole: 'ADMIN' }); 