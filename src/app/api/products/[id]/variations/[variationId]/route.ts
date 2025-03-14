import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse, createNotFoundResponse } from '@/lib/api-response';

/**
 * DELETE: Ürün varyasyonunu sil
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; variationId: string } }
) {
  try {
    const { id: productId, variationId } = params;
    
    // Ürünün var olup olmadığını kontrol et
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      return createNotFoundResponse('Ürün bulunamadı');
    }
    
    // Varyasyonun var olup olmadığını ve bu ürüne ait olup olmadığını kontrol et
    const variation = await prisma.variation.findFirst({
      where: {
        id: variationId,
        productId
      }
    });
    
    if (!variation) {
      return createNotFoundResponse('Varyasyon bulunamadı');
    }
    
    // Önce varyasyon seçeneklerini sil
    await prisma.variationOption.deleteMany({
      where: {
        variationId
      }
    });
    
    // Sonra varyasyonu sil
    await prisma.variation.delete({
      where: {
        id: variationId
      }
    });
    
    return createSuccessResponse(null, 'Varyasyon başarıyla silindi');
  } catch (error: any) {
    console.error('Varyasyon silinirken hata:', error);
    return createErrorResponse('Varyasyon silinirken bir hata oluştu', 500);
  }
} 