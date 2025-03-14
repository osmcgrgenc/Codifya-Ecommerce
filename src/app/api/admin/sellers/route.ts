import { NextRequest } from 'next/server';
import { userService } from '@/services/user-service';
import { withMiddleware } from '@/lib/api-middleware';
import {
  createSuccessResponse,
  createPaginatedResponse,
  createValidationErrorResponse,
  handleValidationResult,
} from '@/lib/api-response';
import { parseQueryParams } from '@/services/api-service';
import { sellerQuerySchema } from './schemas';
import { UserRole } from '@prisma/client';

/**
 * GET: Tüm satıcıları listele (sayfalama ve filtreleme ile)
 */
async function getSellers(req: NextRequest, context: any, session: any) {
  // Sorgu parametrelerini doğrula
  const queryResult = parseQueryParams(req, sellerQuerySchema);
  const validationResult = handleValidationResult(queryResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const { page, limit, search, sortBy, sortOrder } = validationResult.data;

  try {
    // Filtreleri oluştur - sadece satıcı rolündeki kullanıcıları getir
    const filters = {
      search,
      role: UserRole.CUSTOMER, // Satıcılar CUSTOMER rolünde
    };

    // Kullanıcıları getir
    const result = await userService.getPaginatedUsers(page, limit, filters, sortBy, sortOrder);

    // Sadece satıcı ürünleri olan kullanıcıları filtrele
    const sellers = result.data.filter(user => user.ProductSeller && user.ProductSeller.length > 0);

    return createPaginatedResponse(
      sellers,
      result.page,
      result.limit,
      sellers.length,
      'Satıcılar başarıyla getirildi'
    );
  } catch (error) {
    return createValidationErrorResponse(['Satıcılar getirilirken bir hata oluştu']);
  }
}

/**
 * Satıcı API endpoint'leri
 */
export const GET = withMiddleware(getSellers, { requiredRole: 'ADMIN' });
