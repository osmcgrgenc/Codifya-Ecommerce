import { NextRequest } from 'next/server';
import { userService } from '@/services/user-service';
import { withMiddleware } from '@/lib/api-middleware';
import {
  createPaginatedResponse,
  createSuccessResponse,
  createValidationErrorResponse,
  createNotFoundResponse,
  handleValidationResult,
} from '@/lib/api-response';
import { parseQueryParams, parseJsonData } from '@/services/api-service';
import { userQuerySchema, createUserSchema, UserQueryParams, CreateUserData } from './schemas';

/**
 * GET: Kullanıcıları listele (sayfalama ve filtreleme ile)
 */
async function getUsers(req: NextRequest, context: any, session: any) {
  // Sorgu parametrelerini doğrula
  const queryResult = parseQueryParams(req, userQuerySchema);
  if (!queryResult.success) {
    return createValidationErrorResponse(queryResult.errors);
  }

  const { page, limit, search, role, sortBy, sortOrder } = queryResult.data;

  // Filtreleri oluştur
  const filters: any = {};

  if (search) {
    filters.search = search;
  }

  if (role) {
    filters.role = role;
  }

  // Kullanıcıları getir
  const result = await userService.getPaginatedUsers(page, limit, filters, sortBy, sortOrder);

  return createPaginatedResponse(
    result.data,
    result.page,
    result.limit,
    result.total,
    'Kullanıcılar başarıyla listelendi'
  );
}

/**
 * POST: Yeni kullanıcı ekle
 */
async function createUser(req: NextRequest, context: any, session: any) {
  // İstek gövdesini doğrula
  const bodyResult = await parseJsonData(req, createUserSchema);
  const validationResult = handleValidationResult(bodyResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const data = validationResult.data;

  try {
    // Kullanıcıyı oluştur
    const user = await userService.createUser(data);
    return createSuccessResponse(user, 'Kullanıcı başarıyla oluşturuldu', 201);
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * Kullanıcı API endpoint'leri
 */
export const GET = withMiddleware(getUsers, { requiredRole: 'ADMIN' });
export const POST = withMiddleware(createUser, { requiredRole: 'ADMIN' });
