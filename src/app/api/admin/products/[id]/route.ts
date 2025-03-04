import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET: Belirli bir ürünü getir
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const { id } = params;

    // Ürünü getir
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: 'Sunucu hatası', error: error }, { status: 500 });
  }
}

// PUT: Ürün güncelle
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();

    // Ürünün var olup olmadığını kontrol et
    const existingProduct = await db.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    // Slug güncelle (eğer isim değiştiyse ve slug verilmediyse)
    let updateData = { ...body };
    if (body.name && !body.slug) {
      updateData.slug = body.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }

    // Ürünü güncelle
    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        name: updateData.name,
        slug: updateData.slug,
        description: updateData.description,
        price: updateData.price !== undefined ? parseFloat(updateData.price) : undefined,
        stock: updateData.stock !== undefined ? parseInt(updateData.stock) : undefined,
        images: updateData.images,
        categoryId: updateData.categoryId,
        featured: updateData.featured !== undefined ? Boolean(updateData.featured) : undefined,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ message: 'Sunucu hatası', error: error }, { status: 500 });
  }
}

// DELETE: Ürün sil
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const { id } = params;

    // Ürünün var olup olmadığını kontrol et
    const existingProduct = await db.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    // Ürünü sil
    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Sunucu hatası', error: error }, { status: 500 });
  }
}
