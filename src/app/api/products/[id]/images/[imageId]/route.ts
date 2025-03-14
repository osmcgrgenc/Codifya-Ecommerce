import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/services/product';
import { createErrorResponse } from '@/lib/api-response';
import { createSuccessResponse } from '@/lib/api-response';

// Görsel güncelleme
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const imageId = params.imageId;
    const data = await request.json();

    if (!imageId) {
      return createErrorResponse("Görsel ID'si belirtilmedi", 400);
    }

    // Görseli güncelle
    const image = await productService.updateProductImage(imageId, {
      url: data.url,
      isMain: data.isMain,
    });

    return createSuccessResponse(image, 'Görsel başarıyla güncellendi');
  } catch (error) {
    return createErrorResponse('Görsel güncellenirken bir hata oluştu', 500);
  }
}

// Görsel silme
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const imageId = params.imageId;

    if (!imageId) {
      return createErrorResponse("Görsel ID'si belirtilmedi", 400);
    }

    // Görseli sil
    const image = await productService.deleteProductImage(imageId);

    return createSuccessResponse(image, 'Görsel başarıyla silindi');
  } catch (error) {
    return createErrorResponse('Görsel silinirken bir hata oluştu', 500);
  }
}
