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
import { updateSellerSchema } from '../schemas';

/**
 * GET: Belirli bir satıcının detaylarını getir
 */
async function getSellerById(req: NextRequest, { params }: { params: { id: string } }, session: any) {
  const { id } = params;

  // Satıcıyı getir
  const seller = await userService.getUserById(id);

  if (!seller) {
    return createNotFoundResponse('Satıcı');
  }

  // Satıcı ürünlerini getir
  const products = await userService.getUserProducts(id);

  // Satıcı bilgilerini ve ürünlerini birleştir
  const sellerWithProducts = {
    ...seller,
    products
  };

  return createSuccessResponse(sellerWithProducts, 'Satıcı başarıyla getirildi');
}

/**
 * PATCH: Satıcı güncelle
 */
async function updateSeller(req: NextRequest, { params }: { params: { id: string } }, session: any) {
  const { id } = params;

  // İstek gövdesini doğrula
  const bodyResult = await parseJsonData(req, updateSellerSchema);
  const validationResult = handleValidationResult(bodyResult);
  
  if (!validationResult.success) {
    return validationResult.response;
  }

  const data = validationResult.data;
  
  try {
    // Satıcının var olup olmadığını kontrol et
    const existingSeller = await userService.getUserById(id);
    if (!existingSeller) {
      return createNotFoundResponse('Satıcı');
    }
    
    // Satıcıyı güncelle
    const updatedSeller = await userService.updateUser(id, data);
    
    return createSuccessResponse(updatedSeller, 'Satıcı başarıyla güncellendi');
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * DELETE: Satıcı sil
 */
async function deleteSeller(req: NextRequest, { params }: { params: { id: string } }, session: any) {
  const { id } = params;

  try {
    // Satıcının var olup olmadığını kontrol et
    const existingSeller = await userService.getUserById(id);
    if (!existingSeller) {
      return createNotFoundResponse('Satıcı');
    }
    
    // Satıcının ürünlerini kontrol et
    const products = await userService.getUserProducts(id);
    if (products && products.length > 0) {
      return createValidationErrorResponse(
        ['Bu satıcının ürünleri var. Önce satıcının ürünlerini silmelisiniz.']
      );
    }
    
    // Satıcıyı sil
    const deletedSeller = await userService.deleteUser(id);
    
    return createSuccessResponse(deletedSeller, 'Satıcı başarıyla silindi');
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * Satıcı detay API endpoint'leri
 */
export const GET = withMiddleware(getSellerById, { requiredRole: 'ADMIN' });
export const PATCH = withMiddleware(updateSeller, { requiredRole: 'ADMIN' });
export const DELETE = withMiddleware(deleteSeller, { requiredRole: 'ADMIN' }); 