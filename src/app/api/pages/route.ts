import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Sayfalar yüklenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sayfalar yüklenirken bir hata oluştu' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, content, status } = body;

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        status,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Sayfa oluşturulurken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sayfa oluşturulurken bir hata oluştu' }, { status: 500 });
  }
}
