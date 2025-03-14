import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/services/product';
import { createErrorResponse } from '@/lib/api-response';
import { createSuccessResponse } from '@/lib/api-response';

// Görsel ekleme
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id;
    const data = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Ürün ID'si belirtilmedi" }, { status: 400 });
    }

    if (!data.url) {
      return NextResponse.json({ error: "Görsel URL'si belirtilmedi" }, { status: 400 });
    }

    // Görsel ekle
    const image = await productService.addProductImage(productId, {
      url: data.url,
      isMain: data.isMain || false,
    });

    return createSuccessResponse(image, 'Görsel başarıyla eklendi');
  } catch (error) {
    return createErrorResponse('Görsel eklenirken bir hata oluştu', 500);
  }
}

// Görselleri getir
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id;

    if (!productId) {
      return createErrorResponse("Ürün ID'si belirtilmedi", 400);
    }

    // Görselleri getir
    const images = await productService.getProductImages(productId);

    return createSuccessResponse(images, 'Görseller başarıyla getirildi');
  } catch (error) {
    return createErrorResponse('Görseller getirilirken bir hata oluştu', 500);
  }
}
