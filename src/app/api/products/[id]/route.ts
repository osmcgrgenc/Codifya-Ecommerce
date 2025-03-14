import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/services/product';

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

    return NextResponse.json(product);
  } catch (error) {
    console.error('Ürün detayı getirilirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Ürün detayı getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
