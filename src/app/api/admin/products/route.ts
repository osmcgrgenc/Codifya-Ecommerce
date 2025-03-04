import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { ProductFilter } from '@/services/product-service';

// GET: Ürünleri listele (sayfalama ve filtreleme ile)
export async function GET(request: NextRequest) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    // URL parametrelerini al
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const featured = searchParams.get('featured');

    // Sayfalama için hesaplamalar
    const skip = (page - 1) * limit;

    // Filtreleri oluştur
    const where: any = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (categoryId && categoryId !== 'ALL') {
      where.categoryId = categoryId;
    }

    if (featured === 'true') {
      where.featured = true;
    } else if (featured === 'false') {
      where.featured = false;
    }

    // Toplam ürün sayısını al
    const total = await db.product.count({ where });

    // Geçerli sıralama alanını kontrol et
    const validSortFields = ['name', 'price', 'stock', 'createdAt', 'updatedAt'];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    // Ürünleri getir
    const products = await db.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        [finalSortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    // Toplam sayfa sayısını hesapla
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: products,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Sunucu hatası', error: error }, { status: 500 });
  }
}

// POST: Yeni ürün ekle
export async function POST(request: NextRequest) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    // İstek gövdesini al
    const body = await request.json();

    // Zorunlu alanları kontrol et
    if (!body.name || !body.price || !body.categoryId) {
      return NextResponse.json(
        { error: 'Ürün adı, fiyat ve kategori zorunludur' },
        { status: 400 }
      );
    }

    // Slug oluştur
    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    // Ürünü oluştur
    const product = await db.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description || '',
        price: parseFloat(body.price),
        stock: parseInt(body.stock || '0'),
        images: body.images,
        brandId: body.brandId,
        categoryId: body.categoryId,
        featured: body.featured || false,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Sunucu hatası', error: error }, { status: 500 });
  }
}
