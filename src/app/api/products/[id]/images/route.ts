import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/services/product';

// Görsel ekleme
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const data = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Ürün ID\'si belirtilmedi' },
        { status: 400 }
      );
    }
    
    if (!data.url) {
      return NextResponse.json(
        { error: 'Görsel URL\'si belirtilmedi' },
        { status: 400 }
      );
    }
    
    // Görsel ekle
    const image = await productService.addProductImage(productId, {
      url: data.url,
      isMain: data.isMain || false,
    });
    
    return NextResponse.json(image);
  } catch (error) {
    console.error('Görsel eklenirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Görsel eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Görselleri getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Ürün ID\'si belirtilmedi' },
        { status: 400 }
      );
    }
    
    // Görselleri getir
    const images = await productService.getProductImages(productId);
    
    return NextResponse.json(images);
  } catch (error) {
    console.error('Görseller getirilirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Görseller getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 