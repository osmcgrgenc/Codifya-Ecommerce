import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ImportService } from '@/services/import-service';

// Geçerli şablon tipleri
const VALID_TEMPLATE_TYPES = ['products', 'categories', 'brands', 'variants'] as const;
type TemplateType = (typeof VALID_TEMPLATE_TYPES)[number];

/**
 * Excel şablonu indirme için API endpoint'i
 */
export async function GET(request: NextRequest, { params }: { params: { type: string } }) {
  try {
    // Oturum kontrolü
    const session = await checkAdminSession();
    if (!session.success) {
      return session.response;
    }

    // Şablon tipi kontrolü
    const typeValidation = validateTemplateType(params.type);
    if (!typeValidation.success) {
      return typeValidation.response;
    }

    // Şablon oluştur ve döndür
    return createTemplateResponse(params.type as TemplateType);
  } catch (error: any) {
    return NextResponse.json(
      { error: `Şablon oluşturma başarısız: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * Admin oturumunu kontrol eder
 */
async function checkAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Bu işlem için yetkiniz bulunmamaktadır' },
        { status: 403 }
      ),
    };
  }

  return { success: true };
}

/**
 * Şablon tipini kontrol eder
 */
function validateTemplateType(type: string) {
  if (!VALID_TEMPLATE_TYPES.includes(type as TemplateType)) {
    return {
      success: false,
      response: NextResponse.json({ error: 'Geçersiz şablon tipi' }, { status: 400 }),
    };
  }

  return { success: true };
}

/**
 * Şablon yanıtı oluşturur
 */
function createTemplateResponse(type: TemplateType): NextResponse {
  const importService = new ImportService();
  const templateBlob = importService.createTemplate(type);
  const fileName = `${type}_template.xlsx`;

  return new NextResponse(templateBlob, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
  });
}
