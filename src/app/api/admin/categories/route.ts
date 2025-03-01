import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: Tüm kategorileri listele
export async function GET(request: NextRequest) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    // Kategorileri getir
    const categories = await db.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ message: 'Sunucu hatası', error: error }, { status: 500 });
  }
}

// POST: Yeni kategori ekle
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
    if (!body.name) {
      return NextResponse.json({ error: 'Kategori adı zorunludur' }, { status: 400 });
    }

    // Slug oluştur
    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-');

    // Kategoriyi oluştur
    const category = await db.category.create({
      data: {
        name: body.name,
        slug,
        description: body.description || null,
        parentId: body.parentId || null,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Sunucu hatası', error: error }, { status: 500 });
  }
}
