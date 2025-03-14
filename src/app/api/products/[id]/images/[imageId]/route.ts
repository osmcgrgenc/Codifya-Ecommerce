import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/services/product';

// Görsel güncelleme
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const imageId = params.imageId;
    const data = await request.json();

    if (!imageId) {
      return NextResponse.json({ error: "Görsel ID'si belirtilmedi" }, { status: 400 });
    }

    // Görseli güncelle
    const image = await productService.updateProductImage(imageId, {
      url: data.url,
      isMain: data.isMain,
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Görsel güncellenirken hata oluştu:', error);
    return NextResponse.json({ error: 'Görsel güncellenirken bir hata oluştu' }, { status: 500 });
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
      return NextResponse.json({ error: "Görsel ID'si belirtilmedi" }, { status: 400 });
    }

    // Görseli sil
    const image = await productService.deleteProductImage(imageId);

    return NextResponse.json(image);
  } catch (error) {
    console.error('Görsel silinirken hata oluştu:', error);
    return NextResponse.json({ error: 'Görsel silinirken bir hata oluştu' }, { status: 500 });
  }
}
