import { NextRequest } from 'next/server';
import { orderService } from '@/services/order-service';
import { withMiddleware } from '@/lib/api-middleware';
import {
  createSuccessResponse,
  createPaginatedResponse,
  createValidationErrorResponse,
  handleValidationResult,
} from '@/lib/api-response';
import { parseQueryParams } from '@/services/api-service';
import { orderQuerySchema } from './schemas';

/**
 * GET: Tüm siparişleri listele (sayfalama ve filtreleme ile)
 */
async function getOrders(req: NextRequest, context: any, session: any) {
  // Sorgu parametrelerini doğrula
  const queryResult = parseQueryParams(req, orderQuerySchema);
  const validationResult = handleValidationResult(queryResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const { page, limit, search, status, userId, sortBy, sortOrder, startDate, endDate } =
    validationResult.data;

  try {
    // Filtreleri oluştur
    const filters = {
      search,
      status,
      userId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    // Siparişleri getir
    const orders = await orderService.getAllOrders();

    // TODO: Sayfalama ve filtreleme özelliği eklenecek
    // Şimdilik tüm siparişleri dönüyoruz
    return createSuccessResponse(orders, 'Siparişler başarıyla getirildi');
  } catch (error) {
    return createValidationErrorResponse(['Siparişler getirilirken bir hata oluştu']);
  }
}

/**
 * Sipariş API endpoint'leri
 */
export const GET = withMiddleware(getOrders, { requiredRole: 'ADMIN' });
