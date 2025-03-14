import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/services/product';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-response';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "Ürün ID'si belirtilmedi" }, { status: 400 });
    }

    // Ürün detayını getir
    const product = await productService.getProductById(id);

    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    return createSuccessResponse(product, 'Ürün detayı başarıyla getirildi');
  } catch (error) {
    return createErrorResponse('Ürün detayı getirilirken bir hata oluştu', 500);
  }
}
