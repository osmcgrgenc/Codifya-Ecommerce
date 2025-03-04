import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ImportService, ImportResult } from '@/services/import-service';

// Geçerli içe aktarma tipleri
const VALID_IMPORT_TYPES = ['products', 'categories', 'brands', 'variants'] as const;
type ImportType = (typeof VALID_IMPORT_TYPES)[number];

// Geçerli dosya tipleri
const VALID_FILE_TYPES = ['xlsx', 'xls'];

/**
 * İçe aktarma işlemi için API endpoint'i
 */
export async function POST(request: NextRequest, { params }: { params: { type: string } }) {
  try {
    // Oturum kontrolü
    const session = await checkAdminSession();
    if (!session.success) {
      return session.response;
    }

    // Dosya kontrolü
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return createErrorResponse('Dosya bulunamadı', 400);
    }

    // Dosya tipi kontrolü
    const fileValidation = validateFileType(file);
    if (!fileValidation.success) {
      return fileValidation.response;
    }

    // İçe aktarma tipi kontrolü
    const typeValidation = validateImportType(params.type);
    if (!typeValidation.success) {
      return typeValidation.response;
    }

    // İçe aktarma işlemini başlat
    const importService = new ImportService();
    const result = await processImport(importService, params.type as ImportType, file);

    return NextResponse.json(result);
  } catch (error: any) {
    return createErrorResponse(`İçe aktarma başarısız: ${error.message}`, 500);
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
 * Dosya tipini kontrol eder
 */
function validateFileType(file: File) {
  const fileType = file.name.split('.').pop()?.toLowerCase();

  if (!fileType || !VALID_FILE_TYPES.includes(fileType)) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Geçersiz dosya formatı. Lütfen .xlsx veya .xls dosyası yükleyin' },
        { status: 400 }
      ),
    };
  }

  return { success: true };
}

/**
 * İçe aktarma tipini kontrol eder
 */
function validateImportType(type: string) {
  if (!VALID_IMPORT_TYPES.includes(type as ImportType)) {
    return {
      success: false,
      response: NextResponse.json({ error: 'Geçersiz içe aktarma tipi' }, { status: 400 }),
    };
  }

  return { success: true };
}

/**
 * İçe aktarma işlemini gerçekleştirir
 */
async function processImport(
  importService: ImportService,
  type: ImportType,
  file: File
): Promise<ImportResult> {
  switch (type) {
    case 'products':
      return await importService.importProducts(file);
    case 'categories':
      return await importService.importCategories(file);
    case 'brands':
      return await importService.importBrands(file);
    case 'variants':
      return await importService.importVariants(file);
    default:
      // Bu noktaya ulaşılmaması gerekir çünkü tip zaten doğrulanmıştır
      throw new Error('Geçersiz içe aktarma tipi');
  }
}

/**
 * Hata yanıtı oluşturur
 */
function createErrorResponse(message: string, status: number): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      totalProcessed: 0,
      successCount: 0,
      errorCount: 1,
      errors: [message],
    },
    { status }
  );
}
