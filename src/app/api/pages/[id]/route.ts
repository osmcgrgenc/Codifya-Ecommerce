import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const page = await prisma.page.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Sayfa bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Sayfa yüklenirken bir hata oluştu:', error);
    return NextResponse.json(
      { error: 'Sayfa yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, slug, content, status } = body;

    const page = await prisma.page.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        slug,
        content,
        status,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Sayfa güncellenirken bir hata oluştu:', error);
    return NextResponse.json(
      { error: 'Sayfa güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.page.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Sayfa başarıyla silindi' });
  } catch (error) {
    console.error('Sayfa silinirken bir hata oluştu:', error);
    return NextResponse.json(
      { error: 'Sayfa silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 