import { NextRequest } from 'next/server';
import { userService } from '@/services/user-service';
import { withMiddleware } from '@/lib/api-middleware';
import { 
  createSuccessResponse, 
  createValidationErrorResponse,
  createNotFoundResponse,
  handleValidationResult
} from '@/lib/api-response';
import { parseJsonData } from '@/services/api-service';
import { updateUserSchema, UpdateUserData } from '../schemas';

/**
 * GET: Belirli bir kullanıcının detaylarını getir
 */
async function getUserById(req: NextRequest, { params }: { params: { id: string } }, session: any) {
  const { id } = params;

  // Kullanıcıyı getir
  const user = await userService.getUserById(id);

  if (!user) {
    return createNotFoundResponse('Kullanıcı');
  }

  return createSuccessResponse(user, 'Kullanıcı başarıyla getirildi');
}

/**
 * PUT: Kullanıcı güncelle
 */
async function updateUser(req: NextRequest, { params }: { params: { id: string } }, session: any) {
  const { id } = params;

  // İstek gövdesini doğrula
  const bodyResult = await parseJsonData(req, updateUserSchema);
  const validationResult = handleValidationResult(bodyResult);
  
  if (!validationResult.success) {
    return validationResult.response;
  }

  const data = validationResult.data;
  
  try {
    // Kullanıcıyı güncelle
    const user = await userService.updateUser(id, data);
    return createSuccessResponse(user, 'Kullanıcı başarıyla güncellendi');
  } catch (error: any) {
    if (error.message.includes('bulunamadı')) {
      return createNotFoundResponse('Kullanıcı');
    }
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * DELETE: Kullanıcı sil
 */
async function deleteUser(req: NextRequest, { params }: { params: { id: string } }, session: any) {
  const { id } = params;

  try {
    // Kullanıcıyı sil
    const user = await userService.deleteUser(id);
    return createSuccessResponse(user, 'Kullanıcı başarıyla silindi');
  } catch (error: any) {
    if (error.message.includes('bulunamadı')) {
      return createNotFoundResponse('Kullanıcı');
    }
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * Kullanıcı detay API endpoint'leri
 */
export const GET = withMiddleware(getUserById, { requiredRole: 'ADMIN' });
export const PUT = withMiddleware(updateUser, { requiredRole: 'ADMIN' });
export const DELETE = withMiddleware(deleteUser, { requiredRole: 'ADMIN' }); 