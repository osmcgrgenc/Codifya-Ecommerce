import { NextRequest } from 'next/server';
import { brandService } from '@/services/brand-service';
import { withMiddleware } from '@/lib/api-middleware';
import {
  createSuccessResponse,
  createValidationErrorResponse,
  createNotFoundResponse,
  handleValidationResult,
} from '@/lib/api-response';
import { parseJsonData } from '@/services/api-service';
import { updateBrandSchema, UpdateBrandData } from '../schemas';

/**
 * GET: Belirli bir markanın detaylarını getir
 */
async function getBrandById(
  req: NextRequest,
  { params }: { params: { id: string } },
  session: any
) {
  const { id } = params;

  // Markayı getir
  const brand = await brandService.getBrandById(id);

  if (!brand) {
    return createNotFoundResponse('Marka');
  }

  return createSuccessResponse(brand, 'Marka başarıyla getirildi');
}

/**
 * PUT: Marka güncelle
 */
async function updateBrand(req: NextRequest, { params }: { params: { id: string } }, session: any) {
  const { id } = params;

  // İstek gövdesini doğrula
  const bodyResult = await parseJsonData(req, updateBrandSchema);
  const validationResult = handleValidationResult(bodyResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const data = validationResult.data;

  try {
    // Markayı güncelle
    const brand = await brandService.updateBrand(id, data);
    return createSuccessResponse(brand, 'Marka başarıyla güncellendi');
  } catch (error: any) {
    if (error.message.includes('bulunamadı')) {
      return createNotFoundResponse('Marka');
    }
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * DELETE: Marka sil
 */
async function deleteBrand(req: NextRequest, { params }: { params: { id: string } }, session: any) {
  const { id } = params;

  try {
    // Markayı sil
    const brand = await brandService.deleteBrand(id);
    return createSuccessResponse(brand, 'Marka başarıyla silindi');
  } catch (error: any) {
    if (error.message.includes('bulunamadı')) {
      return createNotFoundResponse('Marka');
    }
    if (error.message.includes('ürünler bulunduğu için')) {
      return createValidationErrorResponse([error.message]);
    }
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * Marka detay API endpoint'leri
 */
export const GET = withMiddleware(getBrandById, { requiredRole: 'ADMIN' });
export const PUT = withMiddleware(updateBrand, { requiredRole: 'ADMIN' });
export const DELETE = withMiddleware(deleteBrand, { requiredRole: 'ADMIN' });
