import { NextRequest } from 'next/server';
import { categoryService } from '@/services/category-service';
import { withMiddleware } from '@/lib/api-middleware';
import { createSuccessResponse, createServerErrorResponse } from '@/lib/api-response';

/**
 * Kategori ağacını getir
 */
async function getCategoryTree(req: NextRequest, context: any, session: any) {
  try {
    // Kategori ağacını getir
    const categoryTree = await categoryService.getCategoryTree();
    return createSuccessResponse(categoryTree, 'Kategori ağacı başarıyla getirildi');
  } catch (error) {
    return createServerErrorResponse(error);
  }
}

/**
 * Kategori ağacı API endpoint'i
 */
export const GET = withMiddleware(getCategoryTree, { requiredRole: 'ADMIN' });
