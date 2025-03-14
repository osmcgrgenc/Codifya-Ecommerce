import { NextRequest } from 'next/server';
import { brandService } from '@/services/brand-service';
import { withMiddleware } from '@/lib/api-middleware';
import {
  createPaginatedResponse,
  createSuccessResponse,
  createValidationErrorResponse,
  handleValidationResult,
} from '@/lib/api-response';
import { parseQueryParams, parseJsonData } from '@/services/api-service';
import { brandQuerySchema, createBrandSchema, BrandQueryParams, CreateBrandData } from './schemas';

/**
 * GET: Markaları listele (sayfalama ve filtreleme ile)
 */
async function getBrands(req: NextRequest, context: any, session: any) {
  // Sorgu parametrelerini doğrula
  const queryResult = parseQueryParams(req, brandQuerySchema);
  if (!queryResult.success) {
    return createValidationErrorResponse(queryResult.errors);
  }

  const { page, limit, search, sortBy, sortOrder } = queryResult.data;

  // Filtreleri oluştur
  const filters: any = {};

  if (search) {
    filters.search = search;
  }

  // Markaları getir
  const result = await brandService.getPaginatedBrands(page, limit, filters, sortBy, sortOrder);

  return createPaginatedResponse(
    result.data,
    result.page,
    result.limit,
    result.total,
    'Markalar başarıyla listelendi'
  );
}

/**
 * POST: Yeni marka ekle
 */
async function createBrand(req: NextRequest, context: any, session: any) {
  // İstek gövdesini doğrula
  const bodyResult = await parseJsonData(req, createBrandSchema);
  const validationResult = handleValidationResult(bodyResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const data = validationResult.data;

  try {
    // Markayı oluştur
    const brand = await brandService.createBrand(data);
    return createSuccessResponse(brand, 'Marka başarıyla oluşturuldu', 201);
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * Marka API endpoint'leri
 */
export const GET = withMiddleware(getBrands, { requiredRole: 'ADMIN' });
export const POST = withMiddleware(createBrand, { requiredRole: 'ADMIN' });
