import { NextRequest } from 'next/server';
import { categoryService } from '@/services/category-service';
import { withMiddleware } from '@/lib/api-middleware';
import {
  createSuccessResponse,
  createPaginatedResponse,
  createValidationErrorResponse,
  handleValidationResult,
} from '@/lib/api-response';
import { parseJsonData, parseQueryParams } from '@/services/api-service';
import { categoryQuerySchema, createCategorySchema } from './schemas';

/**
 * GET: Tüm kategorileri listele (sayfalama ve filtreleme ile)
 */
async function getCategories(req: NextRequest, context: any, session: any) {
  // Sorgu parametrelerini doğrula
  const queryResult = parseQueryParams(req, categoryQuerySchema);
  const validationResult = handleValidationResult(queryResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const { page, limit, search, sortBy, sortOrder, parentId } = validationResult.data;

  try {
    // Filtreleri oluştur
    const filters = {
      search,
      parentId,
    };

    // Kategorileri getir
    const result = await categoryService.getAllCategories();

    return createSuccessResponse(result, 'Kategoriler başarıyla getirildi');
  } catch (error) {
    return createValidationErrorResponse(['Kategoriler getirilirken bir hata oluştu']);
  }
}

/**
 * POST: Yeni kategori ekle
 */
async function createCategory(req: NextRequest, context: any, session: any) {
  // İstek gövdesini doğrula
  const bodyResult = await parseJsonData(req, createCategorySchema);
  const validationResult = handleValidationResult(bodyResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const data = validationResult.data;

  try {
    // Kategoriyi oluştur
    const category = await categoryService.createCategory(data);
    return createSuccessResponse(category, 'Kategori başarıyla oluşturuldu', 201);
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * Kategori API endpoint'leri
 */
export const GET = withMiddleware(getCategories, { requiredRole: 'ADMIN' });
export const POST = withMiddleware(createCategory, { requiredRole: 'ADMIN' });
