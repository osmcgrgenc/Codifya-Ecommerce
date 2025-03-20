import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-response';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const page = await prisma.page.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!page) {
      return createErrorResponse('Sayfa bulunamadı', 404, []);
    }

    return createSuccessResponse(page);
  } catch (error) {
    return createErrorResponse('Sayfa yüklenirken bir hata oluştu', 500, [
      (error as Error).message,
    ]);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    return createSuccessResponse(page);
  } catch (error) {
    return createErrorResponse('Sayfa güncellenirken bir hata oluştu', 500, [
      (error as Error).message,
    ]);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.page.delete({
      where: {
        id: params.id,
      },
    });

    return createSuccessResponse({ message: 'Sayfa başarıyla silindi' });
  } catch (error) {
    return createErrorResponse('Sayfa silinirken bir hata oluştu', 500, [(error as Error).message]);
  }
}
