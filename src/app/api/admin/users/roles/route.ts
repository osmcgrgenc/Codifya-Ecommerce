import { NextRequest } from 'next/server';
import { userService } from '@/services/user-service';
import { withMiddleware } from '@/lib/api-middleware';
import {
  createSuccessResponse,
  createValidationErrorResponse,
  createNotFoundResponse,
  handleValidationResult,
} from '@/lib/api-response';
import { parseJsonData } from '@/services/api-service';
import { updateUserRoleSchema, UpdateUserRoleData } from '../schemas';

/**
 * POST: Kullanıcı rolünü güncelle
 */
async function updateUserRole(req: NextRequest, context: any, session: any) {
  // İstek gövdesini doğrula
  const bodyResult = await parseJsonData(req, updateUserRoleSchema);
  const validationResult = handleValidationResult(bodyResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const { userId, role } = validationResult.data;

  try {
    // Kullanıcı rolünü güncelle
    const user = await userService.updateUserRole(userId, role);
    return createSuccessResponse(user, 'Kullanıcı rolü başarıyla güncellendi');
  } catch (error: any) {
    if (error.message.includes('bulunamadı')) {
      return createNotFoundResponse('Kullanıcı');
    }
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * Kullanıcı rolleri API endpoint'i
 */
export const POST = withMiddleware(updateUserRole, { requiredRole: 'ADMIN' });
