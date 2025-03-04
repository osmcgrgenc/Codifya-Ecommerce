import { NextRequest } from 'next/server';
import { categoryService } from '@/services/category-service';
import { withMiddleware } from '@/lib/api-middleware';
import { 
  createSuccessResponse, 
  createValidationErrorResponse,
  createNotFoundResponse,
  handleValidationResult
} from '@/lib/api-response';
import { parseJsonData } from '@/services/api-service';
import { updateCategorySchema, UpdateCategoryData } from '../schemas';

/**
 * GET: Belirli bir kategorinin detaylarını getir
 */
async function getCategoryById(req: NextRequest, { params }: { params: { id: string } }, session: any) {
  const { id } = params;

  // Kategoriyi getir
  const category = await categoryService.getCategoryById(id);

  if (!category) {
    return createNotFoundResponse('Kategori');
  }

  return createSuccessResponse(category, 'Kategori başarıyla getirildi');
}

/**
 * PATCH: Kategori güncelle
 */
async function updateCategory(req: NextRequest, { params }: { params: { id: string } }, session: any) {
  const { id } = params;

  // İstek gövdesini doğrula
  const bodyResult = await parseJsonData(req, updateCategorySchema);
  const validationResult = handleValidationResult(bodyResult);
  
  if (!validationResult.success) {
    return validationResult.response;
  }

  const data = validationResult.data;
  
  try {
    // Kategoriyi güncelle
    const category = await categoryService.updateCategory(id, data);
    return createSuccessResponse(category, 'Kategori başarıyla güncellendi');
  } catch (error: any) {
    if (error.message.includes('bulunamadı')) {
      return createNotFoundResponse('Kategori');
    }
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * DELETE: Kategori sil
 */
async function deleteCategory(req: NextRequest, { params }: { params: { id: string } }, session: any) {
  const { id } = params;

  try {
    // Kategoriyi getir
    const category = await categoryService.getCategoryById(id);
    
    if (!category) {
      return createNotFoundResponse('Kategori');
    }
    
    // Alt kategorileri kontrol et
    if (category.children && category.children.length > 0) {
      return createValidationErrorResponse(
        ['Bu kategorinin alt kategorileri var. Önce alt kategorileri silmelisiniz.']
      );
    }
    
    // Kategoriyi sil
    const deletedCategory = await categoryService.deleteCategory(id);
    return createSuccessResponse(deletedCategory, 'Kategori başarıyla silindi');
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * Kategori detay API endpoint'leri
 */
export const GET = withMiddleware(getCategoryById, { requiredRole: 'ADMIN' });
export const PATCH = withMiddleware(updateCategory, { requiredRole: 'ADMIN' });
export const DELETE = withMiddleware(deleteCategory, { requiredRole: 'ADMIN' }); 