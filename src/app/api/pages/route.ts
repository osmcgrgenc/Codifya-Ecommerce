import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-response';

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return createSuccessResponse(pages);
  } catch (error) {
    return createErrorResponse('Sayfalar yüklenirken bir hata oluştu', 500, [
      (error as Error).message,
    ]);
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

    return createSuccessResponse(page);
  } catch (error) {
    return createErrorResponse('Sayfa oluşturulurken bir hata oluştu', 500, [
      (error as Error).message,
    ]);
  }
}
